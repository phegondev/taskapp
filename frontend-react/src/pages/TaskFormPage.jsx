import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../api/ApiService';


const TaskFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        completed: false
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            const fetchTask = async () => {
                try {
                    const response = await ApiService.getTaskById(id);
                    if (response.statusCode === 200) {
                        setFormData(response.data);
                    } else {
                        setError(response.message || 'Failed to fetch task');
                    }
                } catch (err) {
                    setError(err.response?.data?.message || 'Error fetching task');
                }
            };
            fetchTask();
        }
    }, [id, isEdit]);

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title) {
            setError('Title is required');
            return;
        }

        try {
            if (isEdit) {
                await ApiService.updateTask(formData);
            } else {
                await ApiService.createTask({ ...formData });
            }
            navigate('/tasks');
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving task');
        }
    };


    const handleDelete = async (taskId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (confirmDelete) {
            try {
                await ApiService.deleteTask(taskId);
                navigate('/tasks')
            } catch (err) {
                setError(err.response?.data?.message || 'Error deleting task');
            }
        }
    };


    return (
        <div className="task-form-container">
            <h2>{isEdit ? 'Edit Task' : 'Add New Task'}</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title*</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter task description"
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>

                {isEdit && (
                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="completed"
                            name="completed"
                            checked={formData.completed}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                completed: e.target.checked
                            }))}
                        />
                        <label htmlFor="completed">Completed</label>
                    </div>
                )}



                <div className="form-actions">
                    <button type="submit" className="save-button">
                        {isEdit ? 'Update Task' : 'Create Task'}
                    </button>
                    {isEdit && (
                        <div>
                            <button
                                onClick={() => handleDelete(id)}
                                className="delete-button"
                            >
                                Delete
                            </button>

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => navigate('/tasks')}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TaskFormPage;