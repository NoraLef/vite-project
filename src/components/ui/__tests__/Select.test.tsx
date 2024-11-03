import { userEvent, page } from '@vitest/browser/context';
import { render } from 'vitest-browser-react';
import { describe, expect, it } from "vitest";
import { Select } from '../Select';

describe("Select", () => {
    it("should render", () => {
        const { baseElement } = render(<Select />);

        expect(baseElement).toMatchSnapshot();
    });

    // it("should select", () => {
    //     render(<SelectScrollable />);

    //     const optionSelect = page.getByRole('combobox', { name: 'Select a timezone' });
    //     expect.element(optionSelect).toBeVisible();
    //     userEvent.click(optionSelect);
      
    //     const option1 = page.getByRole('option', { name: 'Eastern Standard Time (EST)' });
    //     expect.element(
    //         option1
    //     ).toBeVisible();
    //     userEvent.click(option1);
    //     expect.element(optionSelect).toHaveValue('est');
    // });
});