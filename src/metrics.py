def compute_kpis(plan, tasks):
    T = {t["task_id"]: t for t in tasks}
    total_lateness = 0
    on_time_count = 0
    utilization = {}
    
    for p in plan:
        if not p["res_id"]: 
            continue
        t = T[p["task_id"]]
        lateness = max(0, p["end"] - t["ddl"])
        total_lateness += lateness
        if lateness == 0: 
            on_time_count += 1
        utilization[p["res_id"]] = utilization.get(p["res_id"], 0) + (p["end"] - p["start"])
        
    total_tasks = len(plan) if plan else 1
    return {
        "total_scheduled": len(plan),
        "on_time_pct": round(100 * on_time_count / total_tasks, 1),
        "total_lateness_h": total_lateness,
        "resource_hours": utilization
    }