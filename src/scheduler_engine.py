import csv
from collections import defaultdict, deque

class TaskNode:
    """Class abstraction encapsulating individual job tracking data profiles."""
    def __init__(self, task_id, duration, deadline, priority, profit):
        self.task_id = task_id
        self.duration = duration
        self.deadline = deadline
        self.priority = priority
        self.profit = profit

def parse_and_validate_csv(csv_path):
    tasks_lookup = {}
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cleaned_row = {k.strip(): v.strip() for k, v in row.items() if k}
            tid = cleaned_row.get("task_id", "").strip()
            if not tid:
                continue
                
            try:
                dur = int(cleaned_row["duration_h"]) if cleaned_row.get("duration_h") else 0
                ddl = int(cleaned_row["deadline_h"]) if cleaned_row.get("deadline_h") else 0
                prio = int(cleaned_row["priority"]) if cleaned_row.get("priority") else 0
                profit = int(cleaned_row["profit"]) if cleaned_row.get("profit") else 0
            except ValueError:
                dur = int(cleaned_row.get("duration_h", "0").strip() or "0")
                ddl = int(cleaned_row.get("deadline_h", "0").strip() or "0")
                prio = int(cleaned_row.get("priority", "0").strip() or "0")
                profit = int(cleaned_row.get("profit", "0").strip() or "0")

            deps_raw = cleaned_row.get("depends_on", "")
            deps = [d.strip() for d in deps_raw.split("|") if d.strip()] if deps_raw else []
            
            tasks_lookup[tid] = {
                "node": TaskNode(tid, dur, ddl, prio, profit),
                "depends_on": deps
            }
    return tasks_lookup

def compute_topological_sequence(tasks_dict):
    in_degree = defaultdict(int)
    graph = defaultdict(list)
    
    for tid, data in tasks_dict.items():
        for dep in data["depends_on"]:
            if dep in tasks_dict:
                graph[dep].append(tid)
                in_degree[tid] += 1

    queue = deque([tid for tid in tasks_dict if in_degree[tid] == 0])
    ordered_sequence = []
    
    while queue:
        current_list = sorted(list(queue), key=lambda x: (-tasks_dict[x]["node"].priority, tasks_dict[x]["node"].deadline))
        current = current_list[0]
        queue.remove(current)
        
        ordered_sequence.append(current)
        for child in graph[current]:
            in_degree[child] -= 1
            if in_degree[child] == 0:
                queue.append(child)
                
    return ordered_sequence

def execute_greedy_allocation(tasks_dict, sequence):
    current_time = 0
    optimized_timeline = []
    missed_tasks_log = []
    accumulated_profit = 0
    
    for tid in sequence:
        task = tasks_dict[tid]["node"]
        start_marker = current_time
        end_marker = current_time + task.duration
        
        if end_marker <= task.deadline:
            current_time = end_marker
            accumulated_profit += task.profit
            optimized_timeline.append({
                "task_id": tid,
                "start": start_marker,
                "end": end_marker,
                "status": "COMPLETED",
                "profit_yield": task.profit
            })
        else:
            missed_tasks_log.append({
                "task_id": tid,
                "deadline": task.deadline,
                "overrun": end_marker - task.deadline
            })
            
    return optimized_timeline, missed_tasks_log, accumulated_profit