from ortools.sat.python import cp_model

def solve_cpsat(tasks, resources, horizon=72):
    m = cp_model.CpModel()
    H = horizon
    T = {t["task_id"]: t for t in tasks}
    R = {r["res_id"]: r for r in resources}
    
    start = {tid: m.NewIntVar(0, H, f"start_{tid}") for tid in T}
    end = {tid: m.NewIntVar(0, H, f"end_{tid}") for tid in T}
    dur = {tid: T[tid]["dur"] for tid in T}
    itv = {tid: m.NewIntervalVar(start[tid], dur[tid], end[tid], f"itv_{tid}") for tid in T}
    
    x = {(tid, rid): m.NewBoolVar(f"x_{tid}_{rid}") for tid in T for rid in R if T[tid]["skill"] in R[rid]["skills"]}
    
    for tid in T:
        m.Add(sum(x.get((tid, rid), 0) for rid in R if T[tid]["skill"] in R[rid]["skills"]) == 1)
        
    for rid in R:
        itvs = []
        for tid in T:
            if (tid, rid) in x:
                itvs.append(m.NewOptionalIntervalVar(start[tid], dur[tid], end[tid], x[(tid, rid)], f"itv_{tid}_{rid}"))
        m.AddNoOverlap(itvs)
        
    for tid in T:
        for dep in T[tid]["deps"]:
            m.Add(start[tid] >= end[dep])
            
    laten = {}
    for tid in T:
        ddl = T[tid]["ddl"]
        laten[tid] = m.NewIntVar(0, H, f"late_{tid}")
        m.Add(laten[tid] >= end[tid] - ddl)
        m.Add(laten[tid] >= 0)
        
    m.Minimize(sum((10 * (6 - T[tid]["prio"])) * laten[tid] for tid in T))
    
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 5.0
    status = solver.Solve(m)
    
    res_plan = []
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        for tid in T:
            chosen_rid = next((r for (t, r), var in x.items() if t == tid and solver.Value(var) == 1), None)
            res_plan.append({
                "task_id": tid, 
                "res_id": chosen_rid, 
                "start": int(solver.Value(start[tid])), 
                "end": int(solver.Value(end[tid]))
            })
    return status, res_plan