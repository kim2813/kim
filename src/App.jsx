import React, { useMemo, useState } from "react";

// 간단한 Icon 컴포넌트
const SendIcon = () => <span>📤</span>;
const BotIcon = () => <span>🤖</span>;
const UserIcon = () => <span>👤</span>;
const ClockIcon = () => <span>⏱️</span>;
const AlertIcon = () => <span>⚠️</span>;
const ActivityIcon = () => <span>💪</span>;
const CheckIcon = () => <span>✅</span>;

// Card 컴포넌트
const Card = ({ children, className = "" }) => (
  <div className={`rounded-3xl border-0 shadow-sm bg-white ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 md:p-6 ${className}`}>{children}</div>
);

// Button 컴포넌트
const Button = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`bg-slate-900 text-white rounded-2xl px-4 py-3 hover:bg-slate-800 transition ${className}`}
  >
    {children}
  </button>
);

// Tab Button 컴포넌트
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-2xl font-semibold transition ${
      isActive
        ? "bg-slate-900 text-white shadow-md"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`}
  >
    {label}
  </button>
);

// ===== 거북목 데이터 =====
const turtleNeckInitialMessages = [
  {
    role: "ai",
    text: "안녕하세요. 저는 거북목 전용 AI 스트레칭 코치입니다. 목이 뻐근한지, 어깨가 말리는지, 하루에 얼마나 앉아 있는지 말해주면 거북목 완화에 도움이 되는 스트레칭 루틴을 추천해드릴게요.",
  },
];

const turtleNeckKeywords = [
  "거북목",
  "목",
  "목 통증",
  "목 뻐근",
  "뻐근",
  "고개",
  "턱",
  "어깨",
  "컴퓨터",
  "스마트폰",
];

const turtleNeckRoutine = [
  {
    name: "복식호흡",
    time: "1분",
    desc: "어깨에 힘을 빼고 코로 들이마신 뒤 천천히 내쉰다. 목과 어깨 긴장을 먼저 낮춘다.",
  },
  {
    name: "목 측면 스트레칭",
    time: "1분",
    desc: "한쪽 귀를 어깨 쪽으로 기울여 목 옆을 부드럽게 늘린다.",
  },
  {
    name: "소흉근 벽 스트레칭",
    time: "2분",
    desc: "팔을 벽에 대고 몸통을 반대쪽으로 살짝 돌려 가슴 앞쪽을 연다.",
  },
  {
    name: "턱 당기기",
    time: "2분",
    desc: "고개를 숙이지 않고 턱을 뒤로 가볍게 당긴다.",
  },
  {
    name: "벽 천사 운동",
    time: "2분",
    desc: "등을 벽에 대고 팔을 천천히 위아래로 움직인다.",
  },
];

const shortTurtleNeckRoutine = [
  { name: "복식호흡", time: "1분", desc: "목과 어깨 힘을 빼고 천천히 호흡한다." },
  { name: "턱 당기기", time: "2분", desc: "턱을 뒤로 살짝 당겨 거북목 자세를 바로잡는다." },
  { name: "가슴 열기 스트레칭", time: "2분", desc: "양손을 등 뒤로 잡고 가슴을 부드럽게 늘린다." },
];

const turtleNeckQuickPrompts = [
  "거북목이 있고 목이 뻐근해. 기본 루틴 알려줘.",
  "공부하다가 목이 아파. 5분 루틴 알려줘.",
  "어깨가 말리고 목이 앞으로 나온 것 같아.",
  "목이 아프고 손 저림이 있어.",
];

// ===== 라운드숄더 데이터 =====
const roundedShoulderInitialMessages = [
  {
    role: "ai",
    text: "안녕하세요. 저는 라운드숄더 전용 AI 스트레칭 코치입니다. 어깨가 앞으로 말리는지, 승모근이 뭉치는지, 등 사이가 뻐근한지 말해주면 라운드숄더 완화에 도움이 되는 스트레칭 루틴을 추천해드릴게요.",
  },
];

const roundedShoulderKeywords = [
  "라운드숄더",
  "말린 어깨",
  "어깨가 말림",
  "가슴 답답",
  "승모근",
  "등 사이",
  "날개뼈",
  "견갑골",
  "어깨 뭉침",
  "굽은등",
];

const roundedShoulderRoutine = [
  {
    name: "복식호흡과 어깨 힘 빼기",
    time: "1분",
    desc: "어깨를 귀에서 멀리 떨어뜨린다는 느낌으로 힘을 빼고 천천히 호흡한다.",
  },
  {
    name: "소흉근 벽 스트레칭",
    time: "2분",
    desc: "팔을 벽에 대고 몸통을 반대쪽으로 살짝 돌려 가슴 앞쪽을 늘린다.",
  },
  {
    name: "대흉근 문틀 스트레칭",
    time: "2분",
    desc: "문틀에 양팔을 대고 가슴을 앞으로 살짝 내민다.",
  },
  {
    name: "흉추 신전 운동",
    time: "2분",
    desc: "의자 등받이나 폼롤러를 이용해 등 윗부분을 부드럽게 펴준다.",
  },
  {
    name: "벽 천사 운동",
    time: "2분",
    desc: "등을 벽에 대고 팔을 위아래로 천천히 움직인다.",
  },
];

const shortRoundedShoulderRoutine = [
  { name: "어깨 힘 빼기 호흡", time: "1분", desc: "어깨를 내리고 천천히 호흡하면서 승모근 긴장을 줄인다." },
  { name: "소흉근 벽 스트레칭", time: "2분", desc: "벽에 팔을 대고 가슴 앞쪽을 부드럽게 늘린다." },
  { name: "벽 천사 운동", time: "2분", desc: "등을 벽에 대고 팔을 움직이며 어깨와 견갑골 정렬을 회복한다." },
];

const roundedShoulderQuickPrompts = [
  "라운드숄더가 있고 어깨가 앞으로 말려 있어.",
  "승모근이 자주 뭉치고 등 사이가 뻐근해. 5분 루틴 알려줘.",
  "어깨 앞쪽이 답답하고 팔을 들 때 찝히는 느낌이 있어.",
  "어깨가 아프고 손 저림이 있어.",
];

// ===== 공통 위험 신호 =====
const riskKeywords = [
  "저림",
  "마비",
  "감각 이상",
  "힘 빠짐",
  "어지러움",
  "사고",
  "교통사고",
  "심한 통증",
  "팔로 뻗침",
  "손 저림",
];

function hasRiskSignal(text) {
  return riskKeywords.some((word) => text.includes(word));
}

function buildAIResponse(userText, coachType) {
  if (hasRiskSignal(userText)) {
    return {
      warning: true,
      typeLabel: "전문가 상담 권장",
      routine: [],
      text: "입력한 내용에 저림, 마비, 힘 빠짐 같은 위험 신호가 포함될 수 있어요. 이런 경우에는 무리한 스트레칭보다 병원이나 물리치료 전문가에게 확인받는 것이 안전합니다.",
    };
  }

  const isRelated =
    coachType === "turtle"
      ? turtleNeckKeywords.some((word) => userText.includes(word))
      : roundedShoulderKeywords.some((word) => userText.includes(word));

  const isShort =
    userText.includes("3분") ||
    userText.includes("5분") ||
    userText.includes("짧게") ||
    userText.includes("간단") ||
    userText.includes("빨리");

  const routine =
    coachType === "turtle"
      ? isShort
        ? shortTurtleNeckRoutine
        : turtleNeckRoutine
      : isShort
      ? shortRoundedShoulderRoutine
      : roundedShoulderRoutine;

  const coachName = coachType === "turtle" ? "거북목" : "라운드숄더";

  if (!isRelated) {
    return {
      warning: false,
      typeLabel: `${coachName} 기본 루틴`,
      routine,
      text: `정확한 증상은 더 필요하지만, 처음 단계에서는 ${coachName} 완화에 도움이 되는 기본 루틴을 추천할게요.`,
    };
  }

  return {
    warning: false,
    typeLabel: isShort ? `${coachName} 짧은 루틴` : `${coachName} 기본 루틴`,
    routine,
    text: isShort
      ? `짧게 할 수 있는 ${coachName} 루틴을 추천할게요. 쉬는 시간에도 할 수 있는 구성입니다.`
      : `${coachName} 완화에 도움이 되는 기본 루틴을 추천할게요.`,
  };
}

// ===== 메인 앱 =====
export default function AIStretchCoachApp() {
  const [activeCoach, setActiveCoach] = useState("turtle"); // "turtle" or "rounded"
  const [messages, setMessages] = useState(turtleNeckInitialMessages);
  const [input, setInput] = useState("");
  const [lastPlan, setLastPlan] = useState(null);

  const quickPrompts = activeCoach === "turtle" ? turtleNeckQuickPrompts : roundedShoulderQuickPrompts;

  const totalTime = useMemo(() => {
    if (!lastPlan?.routine?.length) return "-";
    const minutes = lastPlan.routine
      .map((item) => Number(item.time.replace("분", "")))
      .reduce((a, b) => a + b, 0);
    return `${minutes}분`;
  }, [lastPlan]);

  const handleSwitchCoach = (coachType) => {
    setActiveCoach(coachType);
    setMessages(coachType === "turtle" ? turtleNeckInitialMessages : roundedShoulderInitialMessages);
    setLastPlan(null);
    setInput("");
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const aiPlan = buildAIResponse(input, activeCoach);
    const aiMessage = { role: "ai", text: aiPlan.text };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setLastPlan(aiPlan);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const coachTitle = activeCoach === "turtle" ? "거북목" : "라운드숄더";
  const coachDesc =
    activeCoach === "turtle"
      ? "목 뻐근함, 거북목을 완화하는 스트레칭 루틴을 추천합니다."
      : "어깨 말림, 승모근 뭉침을 완화하는 스트레칭 루틴을 추천합니다.";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* 헤더 */}
        <header className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl mb-4">
            AI 스트레칭 코치
          </h1>

          {/* 탭 버튼 */}
          <div className="flex gap-3 mb-4">
            <TabButton
              label="🧣 거북목 코치"
              isActive={activeCoach === "turtle"}
              onClick={() => handleSwitchCoach("turtle")}
            />
            <TabButton
              label="💼 라운드숄더 코치"
              isActive={activeCoach === "rounded"}
              onClick={() => handleSwitchCoach("rounded")}
            />
          </div>

          {/* 증상 설명 배너 */}
          <div
            className={`rounded-2xl p-4 ${
              activeCoach === "turtle" ? "bg-blue-50 border border-blue-200" : "bg-green-50 border border-green-200"
            }`}
          >
            <h2 className={`font-semibold mb-2 ${activeCoach === "turtle" ? "text-blue-900" : "text-green-900"}`}>
              {coachTitle} 완화 프로그램
            </h2>
            <p className={`text-sm ${activeCoach === "turtle" ? "text-blue-800" : "text-green-800"}`}>
              {coachDesc}
            </p>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <BotIcon /> <h2 className="text-xl font-semibold">AI 상담 채팅</h2>
              </div>

              <div className="h-[460px] space-y-4 overflow-y-auto rounded-2xl bg-slate-100 p-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="mt-1 rounded-full bg-white p-2 shadow-sm">
                        <BotIcon />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        msg.role === "user" ? "bg-slate-900 text-white" : "bg-white text-slate-800"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.role === "user" && (
                      <div className="mt-1 rounded-full bg-slate-900 p-2 text-white shadow-sm">
                        <UserIcon />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="증상을 입력하세요..."
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                />
                <Button onClick={sendMessage}>
                  <SendIcon />
                </Button>
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="rounded-2xl bg-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <ActivityIcon /> <h2 className="text-xl font-semibold">추천 루틴</h2>
                </div>

                {!lastPlan ? (
                  <p className="text-sm text-slate-500">
                    AI와 대화하면 이곳에 맞춤 루틴이 표시됩니다.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-100 p-3">
                        <div className="text-xs text-slate-500">분석 유형</div>
                        <p className="mt-1 font-semibold">{lastPlan.typeLabel}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-100 p-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <ClockIcon /> 예상 시간
                        </div>
                        <p className="mt-1 font-semibold">{totalTime}</p>
                      </div>
                    </div>

                    {lastPlan.warning && (
                      <div className="flex gap-2 rounded-2xl bg-amber-100 p-3 text-sm text-amber-900">
                        <AlertIcon />
                        위험 신호가 있어 스트레칭 추천을 중단했습니다.
                      </div>
                    )}

                    <div className="space-y-3">
                      {lastPlan.routine.map((item, index) => (
                        <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold">
                              {index + 1}. {item.name}
                            </h3>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                              {item.time}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <CheckIcon /> <h2 className="text-lg font-semibold">현재 포함된 기능</h2>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• 거북목 / 라운드숄더 전환 가능</li>
                  <li>• 증상별 키워드 감지</li>
                  <li>• 기본 / 짧은 루틴 자동 추천</li>
                  <li>• 위험 신호 감지 및 안내</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
