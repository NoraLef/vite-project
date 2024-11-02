import { page } from '@vitest/browser/context'
import { render } from 'vitest-browser-react'
import { SelectScrollable } from "@/SelectScrollable";
import {describe, expect, test} from "vitest";

describe("SelectScrollable", () => {
    test("should render", () => {
        const { baseElement } = render(<SelectScrollable />);

        expect(baseElement).toMatchSnapshot();
    });

    test("should select", () => {
        render(<SelectScrollable />);

        const optionSelect = page.getByRole('combobox', { name: 'Select a timezone' });
        expect.element(optionSelect).toBeVisible();
        optionSelect.click();
      
        const option1 = page.getByRole('option', { name: 'Eastern Standard Time (EST)' });
        expect.element(
            option1
        ).toBeVisible();
        option1.click();
        expect.element(optionSelect).toHaveValue('est');
    });
});