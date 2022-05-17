import { Selector } from 'testcafe';

const titleProductPage = Selector('.title');

export const getTitle = async ({browser}) => {
    let className = await browser.expect(Selector(titleProductPage).innerText);
    console.log(className);
        //return await className === "menu-option  disabled ";
    //return await browser.innerText(titleProductPage);
};