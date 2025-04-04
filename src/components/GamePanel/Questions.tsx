import { motion } from "framer-motion";
import { DecodeHTML } from "./utility/DecodeHTML";

const Questions = ({ currentQuestionIndex, ques }) => {
  return (
    <motion.div
      key={currentQuestionIndex}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative mb-2 md:mb-8"
    >
      <div className="absolute inset-0 transform skew-x-6 rounded-lg bg-purple-700 opacity-30" />
      <div className="relative bg-slate-800 text-white p-4 md:p-8 rounded-lg border-4 border-purple-500 border-r-0 border-l-0 shadow-2xl">
        <h2 className="text-[1.25rem] md:text-[1.65rem] text-center pr-6">
          {DecodeHTML(ques)}
        </h2>
      </div>
    </motion.div>
  );
};

export default Questions;