using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Services;
using Moq;

namespace TaskFlow.Tests;

public class TaskServiceTests
{
    private TaskFlowDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TaskFlowDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new TaskFlowDbContext(options);
    }

    [Fact]
    public async Task GetAllTasksAsync_ReturnsAllTasks()
    {
        // Arrange
        var context = CreateInMemoryContext();
        context.Tasks.AddRange(
            new Api.Models.TaskItem { Id = 1, Title = "Task 1", Description = "Desc 1", Status = Api.Models.TaskStatus.Todo, CreatedAt = DateTime.UtcNow },
            new Api.Models.TaskItem { Id = 2, Title = "Task 2", Description = "Desc 2", Status = Api.Models.TaskStatus.Done, CreatedAt = DateTime.UtcNow }
        );
        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.GetAllTasksAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("Task 1", result[0].Title);
        Assert.Equal("Task 2", result[1].Title);
    }

    [Fact]
    public async Task GetTaskByIdAsync_ReturnsCorrectTask()
    {
        // Arrange
        var context = CreateInMemoryContext();
        context.Tasks.Add(new Api.Models.TaskItem
        {
            Id = 1, Title = "My Task", Description = "My Desc",
            Status = Api.Models.TaskStatus.InProgress, CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.GetTaskByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("My Task", result.Title);
        Assert.Equal("InProgress", result.Status);
    }

    [Fact]
    public async Task GetTaskByIdAsync_ReturnsNull_WhenNotFound()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new TaskService(context);

        // Act
        var result = await service.GetTaskByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateTaskAsync_CreatesAndReturnsTask()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new TaskService(context);
        var dto = new CreateTaskDto { Title = "New Task", Description = "New Desc" };

        // Act
        var result = await service.CreateTaskAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Task", result.Title);
        Assert.Equal("Todo", result.Status);
    }

    [Fact]
    public async Task UpdateTaskAsync_UpdatesAndReturnsTask()
    {
        // Arrange
        var context = CreateInMemoryContext();
        context.Tasks.Add(new Api.Models.TaskItem
        {
            Id = 1, Title = "Old Title", Description = "Old Desc",
            Status = Api.Models.TaskStatus.Todo, CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var dto = new UpdateTaskDto { Title = "New Title", Description = "New Desc", Status = "Done" };

        // Act
        var result = await service.UpdateTaskAsync(1, dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Title", result.Title);
        Assert.Equal("Done", result.Status);
    }

    [Fact]
    public async Task DeleteTaskAsync_DeletesTask_ReturnsTrue()
    {
        // Arrange
        var context = CreateInMemoryContext();
        context.Tasks.Add(new Api.Models.TaskItem
        {
            Id = 1, Title = "Task to delete", Description = "Desc",
            Status = Api.Models.TaskStatus.Todo, CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.DeleteTaskAsync(1);

        // Assert
        Assert.True(result);
        Assert.Empty(context.Tasks);
    }

    [Fact]
    public async Task DeleteTaskAsync_ReturnsFalse_WhenNotFound()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new TaskService(context);

        // Act
        var result = await service.DeleteTaskAsync(999);

        // Assert
        Assert.False(result);
    }
}