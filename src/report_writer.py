import os

def export_performance_report(timeline, missed, score, target_path):
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, mode='w', encoding='utf-8') as f:
        f.write("====================================================\n")
        f.write("       TASK SCHEDULER SYSTEM PIPELINE PROFILE       \n")
        f.write("====================================================\n\n")
        f.write(f"📈 TOTAL EARNED SCORE PROFIT: {score}\n")
        f.write(f"✅ SUCCESSFULLY COMPLETED JOBS COUNTER: {len(timeline)}\n")
        f.write(f"⚠️ TOTAL MISSED DEADLINES LOG COUNTER: {len(missed)}\n\n")
        
        f.write("👉 --- CRITICAL EXECUTED PROGRESSION SEQUENCE ---\n")
        for item in timeline:
            f.write(f" 🕒 [Hour {item['start']:02d}:00 -> Hour {item['end']:02d}:00] ➔ Task Name: {item['task_id']} | Yield: +{item['profit_yield']} Points\n")
            
        if missed:
            f.write("\n👉 --- RESOURCE OVERRUN DEADLINE MISSED BREAKDOWNS ---\n")
            for item in missed:
                f.write(f" 🔥 Task ID: {item['task_id']} | Due Target Limit: {item['deadline']}h | Delay Slip: +{item['overrun']} Hours Over\n")