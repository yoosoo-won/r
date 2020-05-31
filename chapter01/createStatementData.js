class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
  get amount() {
    switch (this.play.type) {
      case 'tragedy': // 비극
        throw `오류 발생`; // 비극 공연료는 TragedyCalculator 사용을 유도.
      case 'comedy': // 희극
        throw `서브클래스에서 처리하세요.`;
      default:
        throw new Error (`알 수 없는 장르: ${this.play.type}`);
    }
  }
  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
  get volumeCredits() {
    return Math.floor(this.performance.audience / 5);
  }
}

const createPerformanceCalculator = (aPerformance, aPlay) => {
  switch (aPlay.type) {
    case 'tragedy': return new TragedyCalculator(aPerformance, aPlay);
    case 'comedy': return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`알 수 없는 장르: ${aPlay.type}`);
  }
};

export default function createStatementData (invoice, plays) {
  console.log('createStatementData');
  const totalAmount = data =>
      data.performances.reduce((total, p) => total + p.amount, 0);
  const totalVolumeCredits = data =>
      data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  const playFor = aPerformance =>
      plays[aPerformance.playID];
  const enrichPerformance = aPerformance => {
    /**
     * @param aPerformance
     * @returns {number}
     * @description aPerformance 역할이 명확하지 않는 경우 부정 관사(a/an)을 붙인다고 한다.by 마틴 파울러
     * 항상 명확성을 높이기 위한 이름을 작성하기 위해 노력할 것!!
     */
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = { ...aPerformance };
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    console.log('result', result);
    return result;
  };
  const amountFor = aPerformance =>
      new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
  // const statementData = {...invoice};
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  console.log('statementData', statementData);
  return statementData;
};