import { Selector } from 'testcafe';

const txtUserName = Selector('#user-name');
const txtPassword = Selector('#password');
const btnLogin = Selector('#login-button');
    

export const login = async ({browser, username, password}) => {
    await browser.typeText(txtUserName, username);
    await browser.typeText(txtPassword, password);
    await browser.click(btnLogin).wait(1000)
};

export const clickLoginButton = async ({browser}) => {
    await browser.click(btnLogin).wait(1000)
};

export const clickWithUserName = async ({browser, username}) => {
    await browser.typeText(txtUserName, username);
    await browser.click(btnLogin).wait(1000)
};