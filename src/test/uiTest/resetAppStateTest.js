import { login } from "../../main/pages/loginPage";
const validDataSet = require('../data/validLoginUser.json');
const productDataSet = require('../data/productData.json');
const taxDataSet = require('../data/taxData.json');
import { Selector } from 'testcafe';

import pageTitle from "../constants/pageTitle";
import domain from "../constants/domain";
import attributes from "../commonAttribute/attributes";

validDataSet.forEach(data => {
fixture `Reset APP State Tests`
    .page(domain().url) .beforeEach(async (browser) => {
        await browser.maximizeWindow();
        await login({
            browser,
            username: data.name,
            password:data.password
        })
        await browser.expect(attributes().eleTitle.innerText).eql(pageTitle().productPageTitle);
        });


        test(`Verify shopping card count reset '${data.name}'`, async t => {
            await t.wait(2000)
               .click(Selector('#react-burger-menu-btn'))
               .click(Selector(productDataSet[4].addToCardId))
               .expect(Selector('#shopping_cart_container>a').innerText).eql('1')
               .click(Selector('#reset_sidebar_link'))
               .expect(Selector('#shopping_cart_container>a').innerText).eql('')
        });
        

        test(`Verify add to card reset '${data.name}'`, async t => {
            await t.wait(2000)
               .click(Selector('#react-burger-menu-btn'))
               .click(Selector(productDataSet[4].addToCardId))
               .expect(Selector(productDataSet[4].removeCardId).innerText).eql('REMOVE')
               .click(Selector('#reset_sidebar_link'))
               .expect(Selector(productDataSet[4].addToCardId).innerText).eql('ADD TO CARD')
        });

});


