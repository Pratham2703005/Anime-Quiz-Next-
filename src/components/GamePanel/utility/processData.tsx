export function processData(response) {
  const mcqs = [];
  const rawData = response.split('!@!').filter(item => item); // Filter to remove empty strings

  // Loop through all the raw data and process each MCQ
  for (let i = 0; i < rawData.length; i += 5) {
    const question = rawData[i].split(":")[1];
    const incorrect_answers = rawData[i + 1].split(":")[1].split("|");
    const correct_answer = rawData[i + 2].split(":")[1];
    const difficulty = rawData[i + 3].split(":")[1];
    const category = rawData[i + 4].split(":")[1];

    mcqs.push({
      question,
      incorrect_answers,
      correct_answer,
      difficulty,
      category,
    });
  }

  return mcqs;
}

// const response = "!@!question:What does HTML stand for?!@!incorrect_answers:HyperText Markup Language|Hyperlinks and Text Markup Language|Home Tool Markup Language!@!correct_answer:HyperText Markup Language!@!difficulty:Easy!@!category:HTML!@!!@!question:Which tag is used to link an external CSS file in HTML?!@!incorrect_answers:<link>|<style>|<h1>!@!correct_answer:<link>!@!difficulty:Easy!@!category:HTML!@!!@!question:What is the purpose of the <p> tag in HTML?!@!incorrect_answers:To create a heading|To create a paragraph|To create a link!@!correct_answer:To create a paragraph!@!difficulty:Easy!@!category:HTML!@!!@!question:What does CSS stand for?!@!incorrect_answers:Creative Style Sheets|Cascading Style Sheets|Computer Style Sheets!@!correct_answer:Cascading Style Sheets!@!difficulty:Easy!@!category:CSS!@!!@!question:How do you select all elements with the class \"myClass\" in CSS?!@!incorrect_answers:.myClass|#myClass|myClass!@!correct_answer:.myClass!@!difficulty:Medium!@!category:CSS!@!!@!question:Which CSS property controls text color?!@!incorrect_answers:text-size|font-family|font-weight!@!correct_answer:color!@!difficulty:Easy!@!category:CSS!@!";

// const res = processData(response);
// console.log(res);
