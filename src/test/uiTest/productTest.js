import { login } from "../../main/pages/loginPage";
const validDataSet = require('../data/validLoginUser.json');
const productDataSet = require('../data/productData.json');
const taxDataSet = require('../data/taxData.json');
import { Selector } from 'testcafe';

import pageTitle from "../constants/pageTitle";
import domain from "../constants/domain";
import attributes from "../commonAttribute/attributes";

validDataSet.forEach(data => {
fixture `Product test Tests`
    .page(domain().url) .beforeEach(async (browser) => {
        await browser.maximizeWindow();
        await login({
            browser,
            username: data.name,
            password:data.password
        })
        await browser.expect(attributes().eleTitle.innerText).eql(pageTitle().productPageTitle);
        });


        productDataSet.forEach(p_data => {
            test(`Verify Product '${p_data.productName}' details with username '${data.name}'`, async t => {
                   
                await t
                .click(Selector(p_data.id))
                .expect(Selector('.inventory_details_name').innerText).eql(p_data.productName) 
                .expect(Selector('.inventory_details_desc').innerText).eql(p_data.description)
                .expect(Selector('.inventory_details_price').innerText).eql('$' +p_data.price)
                .expect(Selector('.inventory_details_img_container').child('img').getAttribute('alt')).eql(p_data.productName);
            
            });
        });

        test(`Verify shopping card count and card view with username '${data.name}'`, async t => {
            await t.wait(2000)
               .click(Selector(productDataSet[1].addToCardId))
               .click(Selector(productDataSet[3].addToCardId))
               .expect(Selector('#shopping_cart_container>a').innerText).eql('2')
               .click(Selector('#shopping_cart_container')).wait(1000)
               .expect(Selector(productDataSet[1].id).innerText).eql(productDataSet[1].productName)
               .expect(Selector(productDataSet[3].id).innerText).eql(productDataSet[3].productName)
               .click(Selector('#continue-shopping')) 
               .click(Selector(productDataSet[3].removeCardId))
               .expect(Selector('#shopping_cart_container>a').innerText).eql('1')
               .click(Selector('#shopping_cart_container')).wait(1000)
               .expect(Selector(productDataSet[1].id).innerText).eql(productDataSet[1].productName);
        });
        
        test(`Verify success checkout '${data.name}'`, async t => {
        
            const stringProd1 = productDataSet[1].id + ">.inventory_item_name"
            const stringProd4 = productDataSet[4].id + ">.inventory_item_name"
            const floatPrice1 = parseFloat(productDataSet[1].price);
            const floatPrice2 = parseFloat(productDataSet[4].price);
            const floatSubTotal = parseFloat(floatPrice1 + floatPrice2);
            const tax = taxDataSet[1].price;
            const floatTax = parseFloat(tax);
            const floatTotal = parseFloat(floatSubTotal + floatTax)
        
            await t.wait(2000)
               .click(Selector(productDataSet[1].addToCardId))
               .click(Selector(productDataSet[4].addToCardId))
               .expect(Selector('#shopping_cart_container>a').innerText).eql('2')
               .click(Selector('#shopping_cart_container')).wait(1000)
               .expect(Selector(productDataSet[1].id).innerText).eql(productDataSet[1].productName)
               .expect(Selector(productDataSet[4].id).innerText).eql(productDataSet[4].productName)
               .click(Selector('#checkout')) 
               .expect(attributes().eleTitle.innerText).eql('CHECKOUT: YOUR INFORMATION')
               .typeText(Selector('#first-name'), "John")
               .typeText(Selector('#last-name'), "Steve")
               .typeText(Selector('#postal-code'), "0094")
               .click(Selector('#continue'))
               .expect(attributes().eleTitle.innerText).eql('CHECKOUT: OVERVIEW')
               .expect(Selector(stringProd1).innerText).eql(productDataSet[1].productName) 
               .expect(Selector(stringProd4).innerText).eql(productDataSet[4].productName)
               .expect(Selector(productDataSet[1].id).nextSibling('.inventory_item_desc').innerText).eql(productDataSet[1].description)
               .expect(Selector(productDataSet[4].id).nextSibling('.inventory_item_desc').innerText).eql(productDataSet[4].description)
               .expect(Selector(productDataSet[1].id).nextSibling('.item_pricebar').child('.inventory_item_price').innerText).eql('$'+productDataSet[1].price)
               .expect(Selector(Selector(productDataSet[4].id).nextSibling('.item_pricebar').child('.inventory_item_price')).innerText).eql('$'+productDataSet[4].price)
               .expect(Selector('.summary_info>.summary_info_label').nth(0).innerText).eql('Payment Information:')
               .expect(Selector('.summary_info>.summary_value_label').nth(0).innerText).eql('SauceCard #31337')
               .expect(Selector('.summary_info>.summary_info_label').nth(1).innerText).eql('Shipping Information:')
               .expect(Selector('.summary_info>.summary_value_label').nth(1).innerText).eql('FREE PONY EXPRESS DELIVERY!')
               .expect(Selector('.summary_info>.summary_subtotal_label').innerText).eql('Item total: $'+ floatSubTotal)
               .expect(Selector('.summary_info>.summary_tax_label').innerText).eql('Tax: $'+ tax)
               .expect(Selector('.summary_info>.summary_total_label').innerText).eql('Total: $'+ floatTotal)
               .click(Selector('#finish'))
               .expect(attributes().eleTitle.innerText).eql('CHECKOUT: COMPLETE!')
               .expect(Selector('h2').innerText).eql('THANK YOU FOR YOUR ORDER')
               .click(Selector('#back-to-products'))
               .expect(attributes().eleTitle.innerText).eql('PRODUCTS');
            });
        
        test(`Verify validation on checkout flow '${data.name}'`, async t => {
            await t.wait(2000)
               .click(Selector(productDataSet[1].addToCardId))
               .click(Selector(productDataSet[3].addToCardId))
               .expect(Selector('#shopping_cart_container>a').innerText).eql('2')
               .click(Selector('#shopping_cart_container')).wait(1000)
               .expect(Selector(productDataSet[1].id).innerText).eql(productDataSet[1].productName)
               .expect(Selector(productDataSet[3].id).innerText).eql(productDataSet[3].productName)
               .click(Selector('#checkout')) 
               .expect(attributes().eleTitle.innerText).eql('CHECKOUT: YOUR INFORMATION')
               .click(Selector('#continue'))
               .expect(Selector('h3').innerText).eql('Error: First Name is required');
               
        });

        test(`Verify sorting A to Z'${data.name}'`, async t => {
            const cellSelector = Selector('.inventory_item_name');
            const array = [];
            productDataSet.forEach(p_data => {
                array.push(p_data.productName)
            });
            const sortData = array.sort(function(a, b){return a - b});
            for (let i = 0; i < sortData.length; i++) {
                let cellText = sortData[i];
                let compareCellText = await cellSelector.nth(i).innerText;
                await t.expect(cellText <= compareCellText).ok();
            }
               
        });

        test(`Verify sorting Z to A'${data.name}'`, async t => {
            const filterSelect = Selector('.product_sort_container');
            const filterOption = filterSelect.find('option');
            await t.click(filterSelect)
            .click(filterOption.withText('Name (Z to A)'));

            const cellSelector = Selector('.inventory_item_name');
            const array = [];
            productDataSet.forEach(p_data => {
                array.push(p_data.productName)
            });

            const sortData = array.reverse(function(a, b){return a - b});
            for (let i = 0; i < sortData.length; i++) {
                let cellText = sortData[i];
                let compareCellText = await cellSelector.nth(i).innerText;
        
                await t.expect(cellText <= compareCellText).ok();
            }
           
               
        });

        test(`Verify sorting Price (low to high) '${data.name}'`, async t => {
            const filterSelect = Selector('.product_sort_container');
            const filterOption = filterSelect.find('option');
            await t.click(filterSelect)
            .click(filterOption.withText('Price (low to high)'));

            const cellSelector = Selector('.inventory_item_price');
            const array = [];
            productDataSet.forEach(p_data => {
                array.push(p_data.price)
            });

            const sortData = array.sort(function(a, b){return a - b});
            for (let i = 0; i < sortData.length; i++) {
                let cellText = '$'+sortData[i];
                let compareCellText = await cellSelector.nth(i).innerText;

                await t.expect(cellText <= compareCellText).ok();
            }
           
               
        });

        test(`Verify sorting Price (high to low) '${data.name}'`, async t => {
            const filterSelect = Selector('.product_sort_container');
            const filterOption = filterSelect.find('option');
            await t.click(filterSelect)
            .click(filterOption.withText('Price (high to low)'));

            const cellSelector = Selector('.inventory_item_price');
            const array = [];
            productDataSet.forEach(p_data => {
                array.push(p_data.price)
            });
            const sortData = array.sort(function(a, b){return b - a});
           
            for (let i = 0; i < sortData.length; i++) {
                let cellText = '$'+sortData[i];
                let compareCellText = await cellSelector.nth(i).innerText;

                await t.expect(cellText <= compareCellText).ok();
            }
           
               
        });
});


