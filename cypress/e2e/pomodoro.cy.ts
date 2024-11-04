// cypress/e2e/todo.cy.ts

import {toDoPage} from "../support/pages";
import {table} from "../support/utils";

describe('Editing todos', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);
        const now = new Date(2024, 0, 1, 23, 15);  // Jan 1, 2024, 23:30
        cy.clock(now);
        cy.visit("/blank.html")
        // @ts-ignore
        cy.deleteDatabase('TodoDB')
        toDoPage.launch()
    });

    it('should be able to record a pomodoro', () => {
        toDoPage.newTask.set("Buy fish")
        toDoPage.saveButton.click()
        toDoPage.tasks.item(0).pomodoroButton.click()
        cy.tick(25 * 60 * 1000 - 1);
        toDoPage.pomodoroRestDialog.assertInvisible()
        toDoPage.tasks.item(0).pomodoroCount.matches("0");
        cy.tick(1);
        toDoPage.pomodoroRestDialog.assertVisible()
        toDoPage.tasks.item(0).pomodoroCount.matches("1");
        cy.tick(5 * 60 * 1000 + 1);
        toDoPage.pomodoroRestDialog.assertInvisible()
        toDoPage.journalTab.click()
        toDoPage.journalDays.matches(table`
        | header |
        | Today  |
        `)
        toDoPage.journalDays.item(0).journalItems.matches(table`
        | time     | title                             |
        | 11:40 PM | 🍅 Completed pomodoro: "Buy fish" |
        `)
    });

    it('should be able to record a pomodoro from kanban', () => {
        toDoPage.newTask.set("Buy fish")
        toDoPage.saveButton.click()
        toDoPage.kanbanTab.click()
        toDoPage.kanbanColumns.item(0).tasks.item(0).pomodoroButton.click()
        cy.tick(25 * 60 * 1000 - 1);
        toDoPage.kanbanColumns.item(0).tasks.item(0).timerDisplay.assertVisible();
        toDoPage.tasksTab.click()
        toDoPage.tasks.item(0).timerDisplay.assertVisible();
        toDoPage.kanbanTab.click()
        toDoPage.pomodoroRestDialog.assertInvisible()
        toDoPage.kanbanColumns.item(0).tasks.item(0).pomodoroCount.matches("0");
        cy.tick(1);
        toDoPage.kanbanColumns.item(0).tasks.item(0).pomodoroCount.matches("1");
        toDoPage.pomodoroRestDialog.assertVisible()
        cy.tick(5 * 60 * 1000 + 1);
        toDoPage.pomodoroRestDialog.assertInvisible()
        toDoPage.journalTab.click()
        toDoPage.journalDays.matches(table`
        | header |
        | Today  |
        `)
        toDoPage.journalDays.item(0).journalItems.matches(table`
        | time     | title                             |
        | 11:40 PM | 🍅 Completed pomodoro: "Buy fish" |
        `)
    });
});