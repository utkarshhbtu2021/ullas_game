import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Award, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useVoice } from "../../contexts/VoiceContext";
import { useUser } from "../../contexts/UserContext";
import Header from "../../components/Header";
import Confetti from "react-confetti";

interface PuzzleQuestion {
  target: string;     // Full target word to build (e.g., "पानी")
  tiles: string[];    // 4 tiles shown to the user
  solution: string[]; // correct sequence of tiles (subset of tiles)
}

const WordPuzzleGame: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { progress, updateProgress } = useUser();

  // Use progress bucket "wordPuzzle" (parallel to counting)
  const currentLevel = progress.wordPuzzle?.level || 1;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  // sequence-building state
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswerSelected, setWrongAnswerSelected] = useState(false);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  // ULLAS Level-2 Game 3: Word Building Puzzle (Q1–Q10)
  // Player must tap tiles in the correct order to build the target word.
  const questions: PuzzleQuestion[] = useMemo(() => ([
    { target: "घर",   tiles: ["घ", "ह", "र", "न"],          solution: ["घ", "र"] },
    { target: "राम",   tiles: ["न", "म", "ा", "र"],          solution: ["र", "ा", "म"] },
    { target: "कमल",  tiles: ["म", "क", "ग", "ल"],          solution: ["क", "म", "ल"] },
    { target: "पानी",  tiles: ["पु", "नी", "पा", "म"],      solution: ["पा", "नी"] },
    { target: "फूल",  tiles: ["फ", "क", "ू", "ल"],          solution: ["फ", "ू", "ल"] },
    { target: "नमक",  tiles: ["ल", "म", "क", "न"],          solution: ["न", "म", "क"] },
    { target: "किताब", tiles: ["कि", "ता", "ब", "लो"],      solution: ["कि", "ता", "ब"] },
    { target: "दूध",  tiles: ["दू", "त", "ध", "प"],         solution: ["दू", "ध"] },
    { target: "गाना",  tiles: ["ना", "क", "पा", "गा"],      solution: ["गा", "ना"] },
    { target: "बच्चा", tiles: ["ट", "च", "चा", "ब"],        solution: ["ब", "च", "चा"] },
  ]), []);

  // Speak intro + per-question prompt
  useEffect(() => {
    speak(
      language === "hi"
        ? "टाइल्स को सही क्रम में चुनकर शब्द बनाएँ"
        : "Select tiles in order to form the word"
    );
    // brief delay before first question prompt
    setTimeout(() => speakCurrentQuestion(), 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentQuestion > 0 && !showResult) {
      speakCurrentQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const speakCurrentQuestion = () => {
    const q = questions[currentQuestion];
    const line =
      language === "hi"
        ? `शब्द बनाएँ: ${q.target}`
        : `Form the word: ${q.target}`;
    speak(line);
  };

  const question = questions[currentQuestion];

  const handleTileClick = (tile: string, index: number) => {
    if (showResult) return;                    // locked while showing result
    if (selectedIndices.includes(index)) return; // no double pick of same tile

    const expectedIdx = selectedTiles.length;  // next required tile position
    const expectedTile = question.solution[expectedIdx];

    if (tile === expectedTile) {
      // correct next tile -> append to sequence
      const newSelectedTiles = [...selectedTiles, tile];
      const newSelectedIndices = [...selectedIndices, index];
      setSelectedTiles(newSelectedTiles);
      setSelectedIndices(newSelectedIndices);

      // if sequence complete => success
      if (newSelectedTiles.length === question.solution.length) {
        const newScore = score + 10;
        setScore(newScore);
        setWrongAnswerSelected(false);
        setShowResult(true);
        speak(
          language === "hi"
            ? `सही! ${question.target}`
            : `Correct! ${question.target}`
        );

        setTimeout(() => {
          goNextQuestion();
        }, 3000);
      }
    } else {
      // wrong selection -> showResult like CountingGame
      setWrongAnswerSelected(true);
      setWrongIndex(index);
      setShowResult(true);
      speak(
        language === "hi"
          ? `गलत! सही उत्तर है ${question.target}`
          : `Wrong! The correct answer is ${question.target}`
      );

      setTimeout(() => {
        goNextQuestion();
      }, 3000);
    }
  };

  const goNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedTiles([]);
      setSelectedIndices([]);
      setWrongAnswerSelected(false);
      setWrongIndex(null);
      setShowResult(false);
    } else {
      completeGame();
    }
  };

  const completeGame = () => {
    const newLevel = Math.min(currentLevel + 1, 5);
    const completed = newLevel >= 5;
    updateProgress("wordPuzzle", {
      level: newLevel,
      score: Math.max(progress.wordPuzzle?.score || 0, score),
      completed,
    });
    setGameCompleted(true);
    speak(`${t("wellDone")}! ${t("score")}: ${score}`);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedTiles([]);
    setSelectedIndices([]);
    setWrongAnswerSelected(false);
    setWrongIndex(null);
    setShowResult(false);
    setGameCompleted(false);
    setTimeout(() => speakCurrentQuestion(), 800);
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen mainHome__inner dashboard">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h2 className={`text-3xl font-bold text-gray-800 mb-4 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t("wellDone")}
            </h2>
            <p className={`text-lg text-gray-600 mb-6 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t("score")}: {score}
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={restartGame}
                className={`px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors duration-200 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}
              >
                {t("tryAgain")}
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className={`px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}
              >
                {t("backToDashboard")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper: style state for each tile button (mimics CountingGame)
  const isTileInSolution = (tile: string) => question.solution.includes(tile);
  const isLastSolutionTile = (tile: string) =>
    tile === question.solution[question.solution.length - 1];

  return (
    <div className="min-h-screen mainHome__inner dashboard">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <span className={`text-gray-600 font-medium ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t("backToDashboard")}
            </span>
          </button>

          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t("level")} {currentLevel}
            </div>
            <div className={`px-4 py-2 bg-success-100 text-success-700 rounded-full font-medium ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t("score")}: {score}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm text-gray-600 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {language === "hi" ? "प्रगति" : "Progress"}
            </span>
            <span className={`text-sm text-gray-600 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-warning-500 to-success-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Game Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Question Title */}
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold text-gray-800 mb-6 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                {language === "hi" ? "शब्द बनाएँ:" : "Form this word:"}
              </h2>

              {/* "Target word" + current build display inside the same styled box as CountingGame */}
              <div className="mb-8 p-8 bg-gradient-to-br from-warning-50 to-orange-50 rounded-2xl border-2 border-warning-200">
                <div className="text-center space-y-3">
                  {/* Target word (shown — the task is to build it, not guess it) */}
                  <div className="text-4xl md:text-5xl font-bold">
                    {question.target}
                  </div>

                  {/* Built so far */}
                  <div className="text-lg md:text-xl text-gray-700">
                    {language === "hi" ? "चयनित:" : "Selected:"}{" "}
                    <span className="font-bold">
                      {selectedTiles.length > 0 ? selectedTiles.join("") : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Options Grid (same look & feel as CountingGame) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {question.tiles.map((tile, index) => {
                // Determine class for each tile to mirror CountingGame feedback
                let className =
                  "p-6 rounded-2xl font-bold text-3xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 relative overflow-hidden ";

                if (showResult) {
                  if (!wrongAnswerSelected && isTileInSolution(tile)) {
                    // Correct sequence completed -> highlight all solution tiles in green
                    className += "bg-success-500 text-white shadow-lg animate-pulse-slow";
                  } else if (wrongAnswerSelected && wrongIndex === index) {
                    // Wrong tile the user tapped -> red
                    className += "bg-error-500 text-white shadow-lg";
                  } else {
                    // Disabled gray for the rest
                    className += "bg-gray-200 text-gray-400 cursor-not-allowed";
                  }
                } else {
                  // While playing (no final result yet)
                  className +=
                    "bg-gradient-to-br from-warning-100 to-warning-200 text-warning-700 hover:from-warning-200 hover:to-warning-300 shadow-md hover:shadow-lg focus:ring-warning-300";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleTileClick(tile, index)}
                    disabled={showResult || selectedIndices.includes(index)}
                    className={`${className} ${language === "hi" ? "font-hindi" : "font-english"}`}
                  >
                    {tile}

                    {/* Confetti inside LAST correct tile on success (like CountingGame) */}
                    {showResult && !wrongAnswerSelected && isLastSolutionTile(tile) && (
                      <div className="absolute inset-0 pointer-events-none z-10">
                        <Confetti numberOfPieces={500} recycle={false} width={216} height={80} />
                      </div>
                    )}

                    {!showResult && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Result Feedback Chip (same as CountingGame) */}
            {showResult && (
              <div className="text-center mt-8">
                <div
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-medium animate-bounce-slow ${
                    !wrongAnswerSelected
                      ? "bg-success-100 text-success-700"
                      : "bg-error-100 text-error-700"
                  } ${language === "hi" ? "font-hindi" : "font-english"}`}
                >
                  {!wrongAnswerSelected ? (
                    <>
                      <Award className="h-5 w-5" />
                      <span>
                        {t("correct")}! {question.target}
                      </span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      <span>
                        {t("incorrect")} —{" "}
                        {language === "hi" ? "सही उत्तर" : "Correct"}: {question.target}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPuzzleGame;
