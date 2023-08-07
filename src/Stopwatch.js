import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Stopwatch.css"; // Import the CSS file for styles
import { Container, Paper, Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
};

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setTimeElapsed(0); // Reset the timer on start
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleSave = () => {
    setOpenDialog(true);
    setDialogMode("add");
    setTaskName("");
    setTaskDescription("");
  };

  const handleEdit = (task) => {
    setOpenDialog(true);
    setDialogMode("edit");
    setTaskToEdit(task);
    setTaskName(task.name);
    setTaskDescription(task.description);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTaskName("");
    setTaskDescription("");
    setTaskToEdit(null);
  };

  const handleSaveTask = () => {
    if (dialogMode === "add") {
      // Save the task with timeElapsed, taskName, and taskDescription.
      const newTask = {
        id: Date.now(),
        time: timeElapsed,
        name: taskName,
        description: taskDescription,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } else if (dialogMode === "edit" && taskToEdit) {
      // Update the existing task with new details.
      const updatedTasks = tasks.map((task) =>
        task.id === taskToEdit.id
          ? { ...task, name: taskName, description: taskDescription }
          : task
      );
      setTasks(updatedTasks);
    }
    handleCloseDialog();
  };

  const handleDeleteTask = (taskId) => {
    // Filter out the task with the given taskId
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const { hours, minutes, seconds } = formatTime(timeElapsed);

  return (
    <Container sx={{ my: 20 }} className="containerclass">
      <div className="stopwatch-container">
        <Container
          component={Paper}
          maxWidth={"sm"}
          sx={{
            py: 10,
            boxShadow: 10,
          }}
        >
          <div className="time-display">
            <div className={`time-cube${isRunning ? "-flip" : ""}`}>
              {hours}
            </div>
            :
            <div className={`time-cube${isRunning ? "-flip" : ""}`}>
              {minutes}
            </div>
            :
            <div className={`time-cube${isRunning ? "-flip" : ""}`}>
              <div>{seconds}</div>
            </div>
          </div>

          {!isRunning && (
            <>
              <Button
                sx={{ m: 2 }}
                variant="contained"
                color="success"
                onClick={handleStart}
              >
                Start
              </Button>
              <Button
                sx={{ m: 2 }}
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!timeElapsed}
              >
                Save
              </Button>
            </>
          )}
          {isRunning && (
            <Button
              sx={{ m: 2 }}
              variant="contained"
              color="info"
              onClick={handlePause}
            >
              Pause
            </Button>
          )}
        </Container>
        <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
        >
          <DialogTitle>
            {dialogMode === "add" ? "Add Task" : "Edit Task"}
          </DialogTitle>
          <DialogContent>
          {dialogMode === "add" && 
        
            <TextField
              autoFocus
              margin="dense"
              id="task-name"
              label="Task Name"
              type="text"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          }
            <TextField
              margin="dense"
              id="task-description"
              label="Task Description"
              type="text"
              fullWidth
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveTask}>Save</Button>
          </DialogActions>
        </Dialog>
        <Container maxWidth={"sm"} sx={{ my: 3 }}>
          <div className="task-list">
            <Typography variant="h5" fontWeight={600} color="green">
              SAVED TASKS
            </Typography>
            <List>
              {tasks.map((task) => (
                <ListItem key={task.id}>
                  <ListItemText
                    primary={`Task: ${task.name}`}
                    secondary={`Time: ${formatTime(task.time).hours}h ${
                      formatTime(task.time).minutes
                    }m ${formatTime(task.time).seconds}s`}
                  />
                  <ListItemText
                  sx={{fontWeight:700}}
                    secondary={`Description: ${task.description}`}
                    primaryTypographyProps={{ noWrap: true }} // The title won't wrap and be non-editable
                  />
                  <ListItemIcon>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(task)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              ))}
            </List>
          </div>
        </Container>
      </div>
    </Container>
  );
};

export default Stopwatch;
