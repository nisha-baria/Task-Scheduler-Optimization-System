Task Scheduler Optimization System 🚀

A resilient, production-grade constraint-aware task scheduling and resource allocation optimizer. This system balances complex multi-stage software workflows under strict real-world limitations (Precedence/Dependencies, Shift hours, and Talent skills) utilizing a custom zero-dependency algorithmic backend and an interactive Gantt chart dashboard.

🧠 Core Computer Science & DSA Concepts Mapping

This project is built from scratch without bulky external optimization libraries, serving as an excellent demonstration of fundamental data structures and algorithms applied to complex systems design:

Directed Acyclic Graphs (DAG) & Precedence Constraints: Tasks are modeled as graph nodes, and dependencies are modeled as directed edges.

Kahn's Topological Sorting Algorithm: Runs in $\mathcal{O}(V + E)$ to evaluate a globally valid sequence of operations, making sure no task runs before its prerequisites are completed.

Dynamic Priority Queue (Heuristic Sorters): Solves scheduling tie-breakers dynamically in $\mathcal{O}(N \log N)$ by ordering candidates using multiple indicators:


$$\text{Priority Value} \rightarrow \text{Profit Yield} \rightarrow \text{Earliest Deadline First (EDF)}$$

Greedy Resource Allocation with Interval Partitioning: Automatically tracks timeline segments, moving tasks across day shifts dynamically when capacity is reached.

📁 Repository Structure

The code is highly modular, separating ingestion data models, algorithmic core solvers, file output systems, and interactive visualization layouts.

Task-Scheduler-Optimization-System/
│
├── data/                      # Source CSV datasets
│   └── tasks.csv              # Row values: id, duration, deadline, priority, depends_on
│
├── src/                       # Main Python Backend Packages
│   ├── __init__.py            # Declares folder as importable package
│   └── scheduler_engine.py    # Topological Sort graph logic & allocation engines
│
├── outputs/                   # Automatically generated analytical logs
│   └── performance_report.txt # Full timeline logging, scores, and delay breakdowns
│
├── index.html                 # Premium Interactive Gantt Chart HTML App Dashboard
├── main.py                    # Command-Line System Pipeline Entrypoint
└── README.md                  # Comprehensive Portfolio Presentation (This file)


🚀 Execution & Run Guide

1. Run the Python Backend Pipeline

Execute the zero-dependency scheduler pipeline directly from your terminal to load the database constraints, order the tasks dynamically, and write the report to the disk:

# Windows Native Shell
python main.py

# Mac / Linux Terminals
python3 main.py


2. View the Live Interactive Gantt Dashboard

Simply open the index.html file in any modern web browser (Double-click index.html).

Interactive Sandbox: Add mock custom tasks, set constraints, and see the timeline update instantly!

Play Simulation: Click Play Simulation 🎬 to see the Kahn's Topological heuristic algorithm arrange tasks step-by-step with beautiful glowing visuals.

📊 Comparative Analysis & Output Log Trace

Standard Terminal Console Output

When executed, the system parses the task tables, detects illegal spacing/formatting, resolves the DAG order, and outputs a summary dashboard:

==================================================
      TASK SCHEDULER SYSTEM PIPELINE TRIGGER      
==================================================
Step 1: Reading input datasets and fixing blank structural spaces...
[Success] Successfully loaded 4 system configuration tasks.

Step 2: Resolving Directed Graph Topological Constraints Order...
➔ Evaluated Valid Execution Path Tracking Sequence: ['T1', 'T3', 'T2', 'T4']

Step 3: Calculating Heuristic Time Block Resource Allocations...

Step 4: Writing evaluation data report onto disk vectors...

----------------- TERMINAL DASHBOARD LIVE VIEW -----------------
🚀 Optimized Execution Strategy Completed. Score Matrix Value: 130
🏆 Successfully Processed Tasks: 4 | 📌 Total Deadline Overruns: 0
📝 Full analytical performance log compiled at 'outputs/performance_report.txt'
----------------------------------------------------------------


File Output Summary (outputs/performance_report.txt)

The generated text report provides an audit trace mapping exact hour-blocks to tasks, highlighting any deadlines that were overrun due to resource availability limit:

====================================================
       TASK SCHEDULER SYSTEM PIPELINE PROFILE       
====================================================

📈 TOTAL EARNED SCORE PROFIT: 130
✅ SUCCESSFULLY COMPLETED JOBS COUNTER: 4
⚠️ TOTAL MISSED DEADLINES LOG COUNTER: 0

👉 --- CRITICAL EXECUTED PROGRESSION SEQUENCE ---
 🕒 [Hour 00:00 -> Hour 04:00] ➔ Task Name: T1 | Yield: +40 Points
 🕒 [Hour 04:00 -> Hour 06:00] ➔ Task Name: T3 | Yield: +50 Points
 🕒 [Hour 06:00 -> Hour 12:00] ➔ Task Name: T2 | Yield: +30 Points
 🕒 [Hour 12:00 -> Hour 20:00] ➔ Task Name: T4 | Yield: +10 Points

## 📈 Learning Outcomes & Software Engineering Rigor

Defensive Input Handling: Built strict type-checking and value recovery fallbacks inside Python parser arrays, protecting system runtimes against empty strings, invisible spaces, and corrupted CSV headers.

Microservices-style Separation of Concerns: Designed and structured independent modular files matching modern enterprise standard codebases.

Client-Side Visual Simulation: Bridged backend CS graph theories with clean, high-fidelity responsive animations on the frontend to deliver instant value to
