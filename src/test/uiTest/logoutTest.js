import { login } from "../../main/pages/loginPage";
const validDataSet = require('../data/validLoginUser.json');
import { Selector } from 'testcafe';

import pageTitle from "../constants/pageTitle";
import domain from "../constants/domain";
import attributes from "../commonAttribute/attributes";

validDataSet.forEach(data => {
fixture `Logout Tests`
    .page(domain().url) .beforeEach(async (browser) => {
        await login({
            browser,
            username: data.name,
            password:data.password
        })
        await browser.expect(attributes().eleTitle.innerText).eql(pageTitle().productPageTitle);
        });


        test(`Verify logout in products screen '${data.name}'`, async t => {
            await t.wait(2000)
               .click(Selector('#react-burger-menu-btn'))
               .click(Selector('#logout_sidebar_link'))
               .expect(Selector('#login-button').value).eql('Login')
        });
        


});


