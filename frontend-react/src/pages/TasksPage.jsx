import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService"

const TasksPage = () => {

    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [error, setError] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [completionFilter, setCompletionFilter] = useState('ALL');
    const navigate = useNavigate();
    const isAuthenticated = ApiService.isAthenticated();


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await ApiService.getAllMyTasks();
                if (res.statusCode === 200) {
                    setTasks(res.data);
                    setFilteredTasks(res.data);
                } else {
                    setError(res.message || 'Failed to fetch tasks');

                }

            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching tasks');

            }
        }
        if (isAuthenticated) {
            fetchTasks();
        } else {
            navigate('/login');
        }

    }, [isAuthenticated, navigate]);



    useEffect(() => {
        const applyFilters = async () => {
            try {
                let result = [...tasks];

                //apply completion filter if not "ALL"
                if (completionFilter !== 'ALL') {
                    const res = await ApiService.getMyTasksByCompletionStatus(completionFilter === 'COMPLETED');
                    if (res.statusCode === 200) {
                        result = res.data;
                    }
                }

                //Apply priority filter 
                if (priorityFilter !== 'ALL') {
                    const res = await ApiService.getMyTasksByPriority(priorityFilter);
                    if (res.statusCode === 200) {
                        // If both filters are applied, we need to intersect the results
                        if (completionFilter !== 'ALL') {
                            const priorityTasks = res.data;
                            result = result.filter(task => priorityTasks.some(pt => pt.id === task.id))
                        } else {
                            result = res.data
                        }
                    }
                }
                setFilteredTasks(result);

            } catch (error) {
                setError(error.response?.data?.message || 'Error applying filters');

            }
        }

        if (tasks.length > 0) {
            applyFilters();
        }

    }, [priorityFilter, completionFilter, tasks])



    const toggleComplete = async (taskid, currentStatus) => {
        try {
            const res = await ApiService.updateTask(
                {
                    id: taskid,
                    completed: !currentStatus
                }
            )

            if (res.statusCode === 200) {
                setTasks(tasks.map(task =>
                    task.id === taskid ? { ...task, completed: !currentStatus } : task
                ));
            }

        } catch (error) {
            setError(error.response?.data?.message || 'Error updating task');

        }
    }

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h2>My Tasks</h2>
                <Link to="/tasks/add" className="add-task-button">
                    + Add New Task
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="tasks-filters">
                <div className="filter-group">
                    <label htmlFor="priority-filter">Priority:</label>
                    <select
                        id="priority-filter"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="ALL">All Priorities</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="completion-filter">Status:</label>
                    <select
                        id="completion-filter"
                        value={completionFilter}
                        onChange={(e) => setCompletionFilter(e.target.value)}
                    >
                        <option value="ALL">All Tasks</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PENDING">Pending</option>
                    </select>
                </div>
            </div>

            <div className="tasks-list">
                {filteredTasks.length === 0 ? (
                    <div className="no-tasks">
                        <p>No tasks found matching your filters.</p>
                        <button
                            className="reset-filters-button"
                            onClick={() => {
                                setPriorityFilter('ALL');
                                setCompletionFilter('ALL');
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                            <div className="task-content">
                                <div className="task-header">
                                    <h3>{task.title}</h3>
                                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <p className="task-description">{task.description}</p>
                                <div className="task-meta">
                                    <span className="due-date">
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                    <span className="created-at">
                                        Created: {new Date(task.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="task-actions">
                                <button
                                    onClick={() => toggleComplete(task.id, task.completed)}
                                    className={`complete-button ${task.completed ? 'completed' : ''}`}
                                >
                                    {task.completed ? '✓ Completed' : 'Mark Complete'}
                                </button>
                                <Link
                                    to={`/tasks/edit/${task.id}`}
                                    className="edit-button"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

}

export default TasksPage