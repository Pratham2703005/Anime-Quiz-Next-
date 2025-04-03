export const getDisabledIndexes = (options, correctAnswer, lifeline) => {
    console.log(options, correctAnswer);
  
    const incorrectIndexes = options
      .map((option, index) => (option !== correctAnswer ? index : null))
      .filter((index) => index !== null);
  
    if (lifeline === "audiencePoll") {
      return incorrectIndexes; // Sab incorrect disable
    }
  
    if (lifeline === "fiftyFifty") {
      return incorrectIndexes.sort(() => 0.5 - Math.random()).slice(0, 2); // 2 incorrect disable
    }
  
    if (lifeline === "phoneFriend") {
      const randomCount = Math.floor(Math.random() * 3) + 1; // 1, 2 ya 3 randomly disable
      return incorrectIndexes.sort(() => 0.5 - Math.random()).slice(0, randomCount);
    }
  
    return [];
  };
  