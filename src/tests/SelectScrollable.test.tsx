import { userEvent, page } from '@vitest/browser/context';
import { render } from 'vitest-browser-react';
import { SelectScrollable } from "@/SelectScrollable";
import { describe, expect, it } from "vitest";

describe("SelectScrollable", () => {
    it("should render", () => {
        const { baseElement } = render(<SelectScrollable />);

        expect(baseElement).toMatchSnapshot();
    });

    it("should select", () => {
        render(<SelectScrollable />);

        const optionSelect = page.getByRole('combobox', { name: 'Select a timezone' });
        expect.element(optionSelect).toBeVisible();
        userEvent.click(optionSelect);
      
        const option1 = page.getByRole('option', { name: 'Eastern Standard Time (EST)' });
        expect.element(
            option1
        ).toBeVisible();
        userEvent.click(option1);
        expect.element(optionSelect).toHaveValue('est');
    });

    it.only("should select with playwright", async () => {
        page.render(<SelectScrollable />);

        await expect.element(page.getByRole('combobox').getByText('Select a timezone')).toBeVisible();
        const optionSelect = page.getByRole('combobox').getByText('Select a timezone');
        await optionSelect.click();
      
        const option1 = page.getByRole('option').getByText('Eastern Standard Time (EST)');
        await expect.element(
            option1
        ).toBeVisible();
        await option1.click();
        expect.element(optionSelect).toHaveDisplayValue('Eastern Standard Time (EST)');
    });
});