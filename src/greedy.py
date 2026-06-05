import csv
from collections import defaultdict, deque

def load_tasks(path="data/tasks.csv"):
    tasks = []
    with open(path, mode='current_mode_r' if 'current_mode_r' in locals() else 'r', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            dep = [d.strip() for d in (row["depends_on"] or "").split("|") if d.strip()]
            tasks.append({
                "task_id": row["task_id"].strip(), 
                "dur": int(row["duration_h"]),
                "ddl": int(row["deadline_h"]), 
                "prio": int(row["priority"]),
                "skill": row["skill"].strip(), 
                "deps": dep
            })
    return tasks

def load_resources(path="data/resources.csv"):
    res = []
    with open(path, mode='current_mode_r' if 'current_mode_r' in locals() else 'r', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            res.append({
                "res_id": row["res_id"].strip(),
                "skills": set((row["skills"] or "").split("|")),
                "start": int(row["shift_start_h"]), 
                "end": int(row["shift_end_h"]),
                "max_per_day": int(row["max_hours_per_day"])
            })
    return res

def greedy_schedule(tasks, resources, horizon=48):
    indeg = defaultdict(int)
    children = defaultdict(list)
    for t in tasks:
        for d in t["deps"]: 
            indeg[t["task_id"]] += 1
            children[d].append(t["task_id"])
            
    Q = deque([t["task_id"] for t in tasks if indeg[t["task_id"]] == 0])
    lookup = {t["task_id"]: t for t in tasks}
    topo = []
    
    while Q:
        ids = sorted(list(Q), key=lambda x: (-lookup[x]["prio"], lookup[x]["ddl"]))
        u = ids[0]
        Q.remove(u)
        topo.append(u)
        for v in children[u]:
            indeg[v] -= 1
            if indeg[v] == 0: 
                Q.append(v)
                
    res_state = {r["res_id"]: {"t": r["start"], "day": 0} for r in resources}
    plan = []
    earliest_end = {}
    
    for tid in topo:
        t = lookup[tid]
        dep_end = max([earliest_end[d] for d in t["deps"]] or [0])
        best = None
        
        for r in resources:
            if t["skill"] not in r["skills"]: 
                continue
            cur = max(res_state[r["res_id"]]["t"], dep_end, r["start"])
            
            while cur + t["dur"] > r["end"] + res_state[r["res_id"]]["day"] * 24:
                res_state[r["res_id"]]["day"] += 1
                cur = r["start"] + res_state[r["res_id"]]["day"] * 24
                if cur > horizon: 
                    break
                    
            if cur + t["dur"] <= horizon:
                lateness = max(0, (cur + t["dur"]) - t["ddl"])
                score = (lateness * 100) - (t["prio"] * 10)
                cand = (score, cur, r["res_id"])
                if best is None or cand < best: 
                    best = cand
                    
        if best is not None:
            _, st, rid = best
            plan.append({"task_id": tid, "res_id": rid, "start": st, "end": st + t["dur"]})
            res_state[rid]["t"] = st + t["dur"]
            earliest_end[tid] = st + t["dur"]
            
    return plan