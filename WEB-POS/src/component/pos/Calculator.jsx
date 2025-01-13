import React, { useState, useEffect } from "react";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("calculator"); // 'calculator' or 'converter'
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState({});
  const [clearButtonMode, setClearButtonMode] = useState("AC");

  // Currencies to display in converter
  const currencies = ["USD", "KHR", "CNY"];

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates", error);
        // Fallback rates (not real-time)
        setExchangeRates({
          USD: 1,
          KHR: 4100,
          CNY: 7.15,
        });
      }
    };
    fetchExchangeRates();
  }, [fromCurrency]);

  // Update clear button mode based on input
  useEffect(() => {
    // Change to Delete when input is more than 2 digits
    if (input.length >= 2) {
      setClearButtonMode("Del");
    }
    // Change back to AC when input is empty or zero
    else if (input.length === 0 || input === "0") {
      setClearButtonMode("AC");
    }
  }, [input]);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      // Prevent default for calculator keys
      const calculatorKeys = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "+",
        "-",
        "*",
        "/",
        ".",
        "Enter",
        "Backspace",
        "Escape",
      ];

      if (calculatorKeys.includes(key)) {
        event.preventDefault();
      }

      // Handle keyboard input
      switch (key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "+":
        case "-":
        case "*":
        case "/":
        case ".":
          // Prevent multiple leading zeros
          if (key === "0" && input === "0") return;

          // Remove leading zero when adding new digit
          setInput((prev) => (prev === "0" ? key : prev + key));
          setInput((prev) => prev + key);
          break;
        case "Enter":
          handleCalculate();
          break;
        case "Backspace":
          setInput((prev) => prev.slice(0, -1));
          break;
        case "Escape":
          handleClear();
          break;
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const handleButtonClick = (value) => {
    // Prevent multiple leading zeros
    if (value === "0" && input === "0") return;

    // Remove leading zero when adding new digit
    if (input === "0") {
      setInput(value);
    } else {
      setInput((prev) => prev + value);
    }
  };

  const handleCalculate = () => {
    try {
      const evalResult = eval(input);
      setResult(evalResult);
      setClearButtonMode("AC"); // Ensure AC mode is set after calculation
    } catch (error) {
      setResult("Error");
      setClearButtonMode("AC"); // Set to AC mode even if there's an error
    }
  };

  const handleClear = () => {
    if (clearButtonMode === "AC") {
      // Complete clear
      setInput(""); // Clear input
      setResult(""); // Clear result
      setClearButtonMode("AC"); // Ensure it stays in AC mode
    } else {
      // Delete last character
      setInput((prev) => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    if (input.length >= 2) {
      setClearButtonMode("Del");
    } else if (input.length === 0 || input === "0") {
      setClearButtonMode("AC");
    }
  }, [input, result]); // Added result as a dependency

  const handleToggleSign = () => {
    if (input) {
      setInput(input.startsWith("-") ? input.slice(1) : `-${input}`);
    } else if (result) {
      setInput(
        result.toString().startsWith("-")
          ? result.toString().slice(1)
          : `-${result}`
      );
      setResult("");
    }
  };

  const handlePercentage = () => {
    try {
      const percentValue = eval(input) / 100;
      setInput(percentValue.toString());
    } catch (error) {
      setResult("Error");
    }
  };

  const handleCurrencyConvert = () => {
    if (input && exchangeRates) {
      const convertedAmount = (
        parseFloat(input) *
        (exchangeRates[toCurrency] / exchangeRates[fromCurrency])
      ).toFixed(2);

      setResult(`${convertedAmount} ${toCurrency}`);
    }
  };

  const toggleMode = () => {
    setMode(mode === "calculator" ? "converter" : "calculator");
    setInput("");
    setResult("");
  };
  const renderCalculator = () => (
    <div className="grid grid-cols-4 gap-4 p-6">
      {/* Left side: Numbers and special buttons */}
      <div className="col-span-3 grid grid-cols-3 gap-2">
        <button
          onClick={handleClear}
          className="bg-gray-300 text-black text-2xl font-semibold rounded-full aspect-square hover:bg-gray-400 transition"
        >
          {clearButtonMode}
        </button>
        <button
          onClick={handleToggleSign}
          className="bg-gray-300 text-black text-2xl font-semibold rounded-full aspect-square hover:bg-gray-400 transition"
        >
          +/-
        </button>
        <button
          onClick={handlePercentage}
          className="bg-gray-300 text-black text-2xl font-semibold rounded-full aspect-square hover:bg-gray-400 transition"
        >
          %
        </button>

        {/* Number buttons */}
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."].map((num) => (
          <button
            key={num}
            onClick={() => handleButtonClick(num)}
            className="bg-gray-200 text-black text-2xl font-semibold rounded-full aspect-square hover:bg-gray-300 transition"
          >
            {num}
          </button>
        ))}

        {/* Currency converter toggle button at the bottom */}
        <button
          onClick={toggleMode}
          className="bg-gray-300 text-black text-xl font-semibold rounded-full aspect-square hover:bg-gray-400 transition"
        >
          💱
        </button>
      </div>

      {/* Right side: Operator buttons */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleButtonClick("/")}
          className="bg-orange-500 text-white text-2xl font-semibold rounded-full aspect-square hover:bg-orange-600 transition"
        >
          ÷
        </button>
        <button
          onClick={() => handleButtonClick("*")}
          className="bg-orange-500 text-white text-2xl font-semibold rounded-full aspect-square hover:bg-orange-600 transition"
        >
          ×
        </button>
        <button
          onClick={() => handleButtonClick("-")}
          className="bg-orange-500 text-white text-2xl font-semibold rounded-full aspect-square hover:bg-orange-600 transition"
        >
          -
        </button>
        <button
          onClick={() => handleButtonClick("+")}
          className="bg-orange-500 text-white text-2xl font-semibold rounded-full aspect-square hover:bg-orange-600 transition"
        >
          +
        </button>
        <button
          onClick={handleCalculate}
          className="bg-orange-500 text-white text-2xl font-semibold rounded-full aspect-square hover:bg-orange-600 transition"
        >
          =
        </button>
      </div>
    </div>
  );
  const renderConverter = () => (
    <div className="grid grid-cols-2 gap-4 p-6">
      <button
        onClick={toggleMode}
        className="col-span-2 bg-gray-300 text-black text-xl font-semibold rounded-full hover:bg-gray-400 transition"
      >
        🧮 Back to Calculator
      </button>

      {/* From Currency Selection */}
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        className="col-span-2 bg-gray-200 p-2 rounded-lg"
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>

      {/* To Currency Selection */}
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        className="col-span-2 bg-gray-200 p-2 rounded-lg"
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>

      {/* Amount Input */}
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter amount"
        className="col-span-2 bg-gray-200 p-2 rounded-lg text-right text-2xl"
      />

      {/* Convert Button */}
      <button
        onClick={handleCurrencyConvert}
        className="col-span-2 bg-orange-500 text-white text-2xl font-semibold rounded-full hover:bg-orange-600 transition"
      >
        Convert
      </button>

      {/* Result Display */}
      {result && (
        <div className="col-span-2 bg-green-100 p-2 rounded-lg text-right text-2xl">
          {result}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center mt-7 min-h-ful">
      <div className="bg-white rounded-3xl shadow-xl w-full overflow-hidden">
        <div className="bg-gradient-to-b from-gray-200 to-gray-300 p-1">
          <div className="text-right">
            <div className="text-5xl font-thin text-black opacity-80 mb-1 p-3">
              {input || "0"}
            </div>
            <div className="text-5xl text-gray-600">{result || ""}</div>
          </div>
        </div>

        {mode === "calculator" ? renderCalculator() : renderConverter()}
      </div>
    </div>
  );
};

export default Calculator;
