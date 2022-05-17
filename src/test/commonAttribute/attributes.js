import { Selector } from 'testcafe';

module.exports = function () {
    const attributes = {};
    attributes.eleTitle = Selector('.title');
    attributes.eleErrorMessage = Selector('h3');

    return attributes;
}