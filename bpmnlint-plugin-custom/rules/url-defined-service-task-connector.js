const {
  is
} = require('bpmnlint-utils');
const _ = require('lodash');

/**
 * Rule that reports manual tasks being used.
 */
module.exports = function () {

  function check(node, reporter) {
    if (is(node, 'bpmn:ServiceTask')) {
      const connector = _.find(_.get(node, 'extensionElements.values', []), {$type: 'camunda:Connector'});
      if (connector) {
        const inputParam = _.find(_.get(connector, 'inputOutput.inputParameters', []), {name: 'url'});
        if (!inputParam || !inputParam.value) {
          reporter.report(node.id, 'must define "url" input for service task with Connector');
        } else if (!isUrl(inputParam.value)) {
          reporter.report(node.id, `"url" input param for service task is not valid: "${inputParam.value}"`);
        }
      }
    }
  }

  function isUrl(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
  }

  return {
    check
  };
};

