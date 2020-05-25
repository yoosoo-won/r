export default function createStatementData (invoice, plays) {
  console.log('createStatementData');
  const totalAmount = data => data.performances.reduce((total, p) => total + p.amount, 0);
  const totalVolumeCredits = data => data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  const playFor = aPerformance => plays[aPerformance.playID];
  const enrichPerformance = aPerformance => {
    /**
     * @param aPerformance
     * @returns {number}
     * @description aPerformance 역할이 명확하지 않는 경우 부정 관사(a/an)을 붙인다고 한다.by 마틴 파울러
     * 항상 명확성을 높이기 위한 이름을 작성하기 위해 노력할 것!!
     */
    const result = { ...aPerformance };
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    console.log('result', result);
    return result;
  };
  const amountFor = aPerformance => {

    let result = 0;

    switch (aPerformance.play.type) {
      case 'tragedy': // 비극
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy': // 희극
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error (`알 수 없는 장르: ${aPerformance.play.type}`);
    }
    return result;
  };
  const volumeCreditsFor = aPerformance => {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ('comedy' === aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  };
  // const statementData = {...invoice};
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  console.log('statementData', statementData);
  return statementData;
};