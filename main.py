import sys
from src import scheduler_engine, report_writer

def start_pipeline():
    print("==================================================")
    print("      TASK SCHEDULER SYSTEM PIPELINE TRIGGER      ")
    print("==================================================")
    
    csv_source = "data/tasks.csv"
    report_destination = "outputs/performance_report.txt"
    
    print("Step 1: Reading input datasets and fixing blank structural spaces...")
    try:
        tasks_lookup = scheduler_engine.parse_and_validate_csv(csv_source)
        print(f"[Success] Successfully loaded {len(tasks_lookup)} system configuration tasks.")
    except Exception as e:
        print(f"[Fatal Error] Processing pipeline tracking halted: {e}")
        sys.exit(1)
        
    print("\nStep 2: Resolving Directed Graph Topological Constraints Order...")
    execution_sequence = scheduler_engine.compute_topological_sequence(tasks_lookup)
    print(f"➔ Evaluated Valid Execution Path Tracking Sequence: {execution_sequence}")
    
    print("\nStep 3: Calculating Heuristic Time Block Resource Allocations...")
    timeline, missed, final_profit_score = scheduler_engine.execute_greedy_allocation(tasks_lookup, execution_sequence)
    
    print("\nStep 4: Writing evaluation data report onto disk vectors...")
    # Matches exactly with src/report_writer.py
    report_writer.export_performance_report(timeline, missed, final_profit_score, report_destination)
    
    print("\n----------------- TERMINAL DASHBOARD LIVE VIEW -----------------")
    print(f"🚀 Optimized Execution Strategy Completed. Score Matrix Value: {final_profit_score}")
    print(f"🏆 Successfully Processed Tasks: {len(timeline)} | 📌 Total Deadline Overruns: {len(missed)}")
    print(f"📝 Full analytical performance log compiled at '{report_destination}'")
    print("----------------------------------------------------------------")

if __name__ == "__main__":
    start_pipeline()