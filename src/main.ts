import "./style.css";

type Operator = "+" | "-" | "×" | "÷" | "=";
interface CalculatorInterface {
  tempValue: string | number;
  tempOperator?: Operator | string;
  render(inputValue: string | number): void;
  reset(): void;
  calculate(operator: Operator | string): void;
  initEvent(): void;
}

type ComputedValue = {
  [key in Exclude<Operator, "=">]: (num1: number, num2: number) => number;
};

const VALID_NUMBER_OF_DIGITS = 3;
const INIT_VALUE = 0;

const validateNumLength = (value: string | number) => {
  return String(value).length < VALID_NUMBER_OF_DIGITS;
};

const isZero = (value: string) => Number(value) === 0;

const getComputeValue: ComputedValue = {
  "+": (num1, num2) => num1 + num2,
  "-": (num1, num2) => num1 - num2,
  "×": (num1, num2) => num1 * num2,
  "÷": (num1, num2) => num1 / num2,
};

const Calculator: CalculatorInterface = {
  tempValue: 0,
  tempOperator: undefined,
  render(inputValue: string | number) {
    const resultEl = <HTMLDivElement>document.querySelector(".result");
    const prevValue = resultEl.innerText;

    if (!validateNumLength(prevValue)) {
      alert("3자리 수 이상은 입력할 수 없습니다.");
      return;
    }

    if (resultEl) {
      resultEl.innerText = isZero(prevValue)
        ? String(inputValue)
        : String(prevValue + inputValue);
    }
  },
  reset() {
    const resultEl = <HTMLDivElement>document.querySelector(".result");

    resultEl.innerText = String(INIT_VALUE);
    this.tempValue = INIT_VALUE;
    this.tempOperator = undefined;
  },

  calculate(operator: Operator | string) {
    const isReadyCalculated = operator === "=";
    const isTempCalculated = ["+", "-", "×", "÷"].includes(operator);

    if (isTempCalculated) {
      const resultEl = <HTMLDivElement>document.querySelector(".result");

      this.tempOperator = operator;
      this.tempValue = Number(resultEl.innerText);

      //result를 0으로 바꿔준다.
      resultEl.innerText = String(0);

      return;
    }

    if (
      this.tempOperator &&
      ["+", "-", "×", "÷"].includes(this.tempOperator) &&
      isReadyCalculated
    ) {
      const resultEl = <HTMLDivElement>document.querySelector(".result");

      const resultValue = getComputeValue[
        this.tempOperator as Exclude<Operator, "=">
      ](Number(this.tempValue), Number(resultEl.innerText));

      resultEl.innerText = String(resultValue);
    }

    // this.tempOperator = operator;

    // if (operator === "+") {
    //   plus();
    // }

    // if (operator === "-") {
    //   minus();
    // }

    // if (operator === "×") {
    //   multiply();
    // }

    // if (operator === "÷") {
    //   divide();
    // }
  },

  initEvent() {
    const btnEl = document.querySelector(".contents");
    btnEl?.addEventListener("click", ({ target }) => {
      const btnText = (target as HTMLButtonElement).innerText;

      if (btnText === "AC") {
        this.reset();
        return;
      }

      if (["+", "-", "×", "÷", "="].includes(btnText)) {
        this.calculate(btnText);
        return;
      }

      if (!Number.isNaN(btnText)) {
        this.render(Number(btnText));
      }
    });
  },
};

Calculator.render(INIT_VALUE);
Calculator.initEvent();
