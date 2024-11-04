// cypress/e2e/todo.cy.ts

import {toDoPage} from "../support/pages";
import {table} from "../support/utils";

describe('Editing todos', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);
        const now = new Date(2024, 0, 1, 23, 30);  // Jan 1, 2024, 23:30
        cy.clock(now);
        cy.visit("/blank.html")
        // @ts-ignore
        cy.deleteDatabase('TodoDB')
        toDoPage.launch()
    });

    it.only('should be able to record a pomodoro', () => {
        toDoPage.newTask.set("Buy fish")
        toDoPage.saveButton.click()
        toDoPage.tasks.item(0).pomodoroButton.click()
        cy.tick(29 * 60 * 1000); // Advance 29 mins
        toDoPage.tasks.item(0).pomodoroCount.matches("0");
        cy.tick(1 * 60 * 1000); // Advance 1 min
        toDoPage.tasks.item(0).pomodoroCount.matches("1");
        toDoPage.journalTab.click()
        toDoPage.journalDays.matches(table`
        | header    |
        | Today     |
        `)
        toDoPage.journalDays.item(0).journalItems.matches(table`
        | time     | title                             |
        | 12:00 AM | 🍅 Completed pomodoro: "Buy fish" |
        `)

    });
});