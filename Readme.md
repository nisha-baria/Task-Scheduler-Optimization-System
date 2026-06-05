## Task Scheduler Optimization System 🚀

A resilient, production-grade constraint-aware task scheduling and resource allocation optimizer. This system balances complex multi-stage software workflows under strict real-world limitations (Precedence/Dependencies, Shift hours, and Talent skills) utilizing a custom zero-dependency algorithmic backend.

## 🧠 Core Computer Science Concepts

Directed Acyclic Graphs (DAG): Tasks are modeled as graph nodes, and dependencies are modeled as directed edges.

Kahn's Topological Sorting: Runs in $\mathcal{O}(V + E)$ to evaluate a globally valid sequence of operations, making sure no task runs before its prerequisites.

Dynamic Priority Sorters: Solves tie-breakers by ordering candidates using multiple indicators (Priority -> Profit -> Earliest Deadline).

Greedy Resource Allocation: Automatically tracks timeline segments, moving tasks across day shifts dynamically when capacity is reached.

## 🚀 Execution Guide

1. Run Python Backend Pipeline
Execute the scheduler pipeline directly from your terminal to load constraints and write reports:
python main.py

2. View Live Interactive Dashboard
Open index.html file in any modern web browser to see the glowing visual timeline!

## 📈 Learning Outcomes

Defensive Data Handling: Type-checking fallbacks protecting against empty strings and corrupted CSV headers.
Separation of Concerns: Highly modular file separation matching modern enterprise standards.
