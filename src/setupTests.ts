// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import waitForExpect from 'wait-for-expect';
waitForExpect.defaults.interval = 1;

jest.setTimeout(30000);
