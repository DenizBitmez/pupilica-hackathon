import React, { useState, useEffect } from 'react';
import { HistoricalFigure } from '../types/historical';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface HistoricalQuizProps {
  character: HistoricalFigure;
  isVisible: boolean;
  onClose: () => void;
}

const HistoricalQuiz: React.FC<HistoricalQuizProps> = ({ character, isVisible, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: QuizQuestion[] = [
    {
      id: '1',
      question: character.id === 'fatih_sultan_mehmet' 
        ? 'Fatih Sultan Mehmet hangi yılda İstanbul\'u fethetti?'
        : character.id === 'ataturk'
        ? 'Mustafa Kemal Atatürk hangi tarihte Samsun\'a çıktı?'
        : 'Napolyon hangi savaşta yenildi?',
      options: character.id === 'fatih_sultan_mehmet'
        ? ['1452', '1453', '1454', '1455']
        : character.id === 'ataturk'
        ? ['19 Mayıs 1919', '23 Nisan 1920', '30 Ağustos 1922', '29 Ekim 1923']
        : ['Austerlitz', 'Jena', 'Waterloo', 'Friedland'],
      correctAnswer: 1,
      explanation: character.id === 'fatih_sultan_mehmet'
        ? 'Fatih Sultan Mehmet 29 Mayıs 1453 tarihinde İstanbul\'u fethetmiştir.'
        : character.id === 'ataturk'
        ? 'Mustafa Kemal Atatürk 19 Mayıs 1919\'da Samsun\'a çıkarak Kurtuluş Savaşı\'nı başlatmıştır.'
        : 'Napolyon 18 Haziran 1815\'te Waterloo Savaşı\'nda kesin olarak yenilmiştir.',
      difficulty: 'easy'
    },
    {
      id: '2',
      question: character.id === 'fatih_sultan_mehmet'
        ? 'Fatih Sultan Mehmet\'in en ünlü topu hangisidir?'
        : character.id === 'ataturk'
        ? 'Atatürk\'ün en önemli reformu hangisidir?'
        : 'Napolyon\'un en büyük askeri başarısı hangisidir?',
      options: character.id === 'fatih_sultan_mehmet'
        ? ['Şahi Topu', 'Büyük Top', 'Fatih Topu', 'Konstantinopolis Topu']
        : character.id === 'ataturk'
        ? ['Harf Devrimi', 'Kadın Hakları', 'Eğitim Reformu', 'Sanayi Devrimi']
        : ['Austerlitz Zaferi', 'Jena Savaşı', 'Moskova Seferi', 'Mısır Seferi'],
      correctAnswer: 0,
      explanation: character.id === 'fatih_sultan_mehmet'
        ? 'Şahi Topu, Fatih Sultan Mehmet\'in İstanbul kuşatmasında kullandığı en ünlü toptur.'
        : character.id === 'ataturk'
        ? 'Harf Devrimi, Türkçe\'yi Arap alfabesinden Latin alfabesine geçiren en önemli reformdur.'
        : 'Austerlitz Zaferi, Napolyon\'un en büyük askeri başarısı olarak kabul edilir.',
      difficulty: 'medium'
    },
    {
      id: '3',
      question: character.id === 'fatih_sultan_mehmet'
        ? 'Fatih Sultan Mehmet hangi yaşta padişah oldu?'
        : character.id === 'ataturk'
        ? 'Atatürk\'ün en ünlü sözü hangisidir?'
        : 'Napolyon\'un en büyük hatası hangisidir?',
      options: character.id === 'fatih_sultan_mehmet'
        ? ['19', '21', '23', '25']
        : character.id === 'ataturk'
        ? ['Hayatta en hakiki mürşit ilimdir', 'Ne mutlu Türküm diyene', 'Yurtta sulh, cihanda sulh', 'Türkiye Cumhuriyeti ilelebet payidar kalacaktır']
        : ['Rusya Seferi', 'İspanya Savaşı', 'Mısır Seferi', 'İngiltere İstilası'],
      correctAnswer: 1,
      explanation: character.id === 'fatih_sultan_mehmet'
        ? 'Fatih Sultan Mehmet 21 yaşında padişah olmuştur.'
        : character.id === 'ataturk'
        ? 'Atatürk\'ün en ünlü sözü "Hayatta en hakiki mürşit ilimdir"dir.'
        : 'Rusya Seferi, Napolyon\'un en büyük hatası olarak kabul edilir.',
      difficulty: 'hard'
    }
  ];

  useEffect(() => {
    if (isVisible && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleNextQuestion();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isVisible, quizCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setQuizCompleted(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              🧠 {character.name} Quiz'i
            </h2>
            <p className="text-gray-600">
              Tarih bilginizi test edin!
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {!quizCompleted ? (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Soru {currentQuestion + 1} / {questions.length}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Skor: {score} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${
                timeLeft > 10 ? 'bg-green-100 text-green-800' : 
                timeLeft > 5 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                ⏰ {timeLeft} saniye
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {questions[currentQuestion].question}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    questions[currentQuestion].difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    questions[currentQuestion].difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {questions[currentQuestion].difficulty === 'easy' ? '🟢 Kolay' :
                     questions[currentQuestion].difficulty === 'medium' ? '🟡 Orta' : '🔴 Zor'}
                  </span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                      showResult
                        ? index === questions[currentQuestion].correctAnswer
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : selectedAnswer === index
                          ? 'bg-red-100 border-red-500 text-red-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                        : selectedAnswer === index
                        ? 'bg-blue-100 border-blue-500 text-blue-800'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        showResult
                          ? index === questions[currentQuestion].correctAnswer
                            ? 'bg-green-500 text-white'
                            : selectedAnswer === index
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                          : selectedAnswer === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium">{option}</span>
                      {showResult && index === questions[currentQuestion].correctAnswer && (
                        <span className="ml-auto text-green-600 font-bold">✓</span>
                      )}
                      {showResult && selectedAnswer === index && index !== questions[currentQuestion].correctAnswer && (
                        <span className="ml-auto text-red-600 font-bold">✗</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showResult && (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">💡 Açıklama:</h4>
                  <p className="text-amber-700">{questions[currentQuestion].explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {showResult && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleNextQuestion}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {currentQuestion < questions.length - 1 ? 'Sonraki Soru →' : 'Quiz\'i Tamamla'}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Quiz Completed */
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">
                {score === questions.length ? '🏆' : score >= questions.length * 0.7 ? '🥈' : '🥉'}
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {score === questions.length ? 'Mükemmel!' : 
                 score >= questions.length * 0.7 ? 'Çok İyi!' : 'İyi Deneme!'}
              </h3>
              <p className="text-xl text-gray-600 mb-4">
                {character.name} hakkında {score}/{questions.length} soruyu doğru cevapladınız!
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                %{Math.round((score / questions.length) * 100)} Başarı
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${(score / questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-gray-600">
                {score === questions.length ? 'Tebrikler! Tüm soruları doğru cevapladınız!' :
                 score >= questions.length * 0.7 ? 'Harika! Tarih bilginiz çok iyi!' :
                 'İyi bir başlangıç! Daha fazla öğrenmeye devam edin!'}
              </p>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                🔄 Tekrar Dene
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300"
              >
                ✅ Tamamla
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalQuiz;

