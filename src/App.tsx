import React, { useMemo, useState } from "react";
import { Send, Bot, User, Clock, AlertTriangle, Activity, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const initialMessages = [
  {
    role: "ai",
    text:
      "안녕하세요. 저는 거북목 전용 AI 스트레칭 코치입니다. 목이 뻐근한지, 어깨가 말리는지, 하루에 얼마나 앉아 있는지 말해주면 거북목 완화에 도움이 되는 스트레칭 루틴을 추천해드릴게요.",
  },
];

// 위험 신호 키워드: 이런 증상이 있으면 스트레칭 추천을 멈추고 전문가 상담 안내
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
  "두통 심함",
];

// 거북목 관련 키워드
const turtleNeckKeywords = [
  "거북목",
  "목",
  "목 통증",
  "목 뻐근",
  "뻐근",
  "고개",
  "턱",
  "어깨",
  "라운드숄더",
  "말린 어깨",
  "컴퓨터",
  "스마트폰",
  "공부",
  "앉아",
];

// 거북목 기본 루틴
const turtleNeckRoutine = [
  {
    name: "복식호흡",
    time: "1분",
    desc: "어깨에 힘을 빼고 코로 들이마신 뒤 천천히 내쉰다. 목과 어깨 긴장을 먼저 낮춘다.",
  },
  {
    name: "목 측면 스트레칭",
    time: "1분",
    desc: "한쪽 귀를 어깨 쪽으로 기울여 목 옆을 부드럽게 늘린다. 반대쪽도 같은 방식으로 진행한다.",
  },
  {
    name: "소흉근 벽 스트레칭",
    time: "2분",
    desc: "팔을 벽에 대고 몸통을 반대쪽으로 살짝 돌려 가슴 앞쪽을 연다. 말린 어깨 완화에 도움을 준다.",
  },
  {
    name: "턱 당기기",
    time: "2분",
    desc: "고개를 숙이지 않고 턱을 뒤로 가볍게 당긴다. 목 뒤가 길어지는 느낌으로 진행한다.",
  },
  {
    name: "벽 천사 운동",
    time: "2분",
    desc: "등을 벽에 대고 팔을 천천히 위아래로 움직인다. 어깨와 견갑골 정렬을 돕는다.",
  },
];

// 짧은 루틴: 3~5분 요청 시 사용
const shortTurtleNeckRoutine = [
  {
    name: "복식호흡",
    time: "1분",
    desc: "목과 어깨 힘을 빼고 천천히 호흡한다.",
  },
  {
    name: "턱 당기기",
    time: "2분",
    desc: "턱을 뒤로 살짝 당겨 거북목 자세를 바로잡는 느낌을 만든다.",
  },
  {
    name: "가슴 열기 스트레칭",
    time: "2분",
    desc: "양손을 등 뒤로 잡거나 벽을 이용해 가슴 앞쪽을 부드럽게 늘린다.",
  },
];

function hasRiskSignal(text) {
  return riskKeywords.some((word) => text.includes(word));
}

function isTurtleNeckRelated(text) {
  return turtleNeckKeywords.some((word) => text.includes(word));
}

function wantsShortRoutine(text) {
  return text.includes("3분") || text.includes("5분") || text.includes("짧게") || text.includes("간단") || text.includes("빨리");
}

function buildAIResponse(userText) {
  if (hasRiskSignal(userText)) {
    return {
      warning: true,
      typeLabel: "전문가 상담 권장",
      routine: [],
      text:
        "입력한 내용에 저림, 마비, 힘 빠짐, 어지러움 같은 위험 신호가 포함될 수 있어요. 이런 경우에는 무리한 스트레칭보다 병원이나 물리치료 전문가에게 확인받는 것이 안전합니다.",
    };
  }

  const related = isTurtleNeckRelated(userText);
  const shortMode = wantsShortRoutine(userText);
  const routine = shortMode ? shortTurtleNeckRoutine : turtleNeckRoutine;

  if (!related) {
    return {
      warning: false,
      typeLabel: "거북목 기본 루틴",
      routine,
      text:
        "정확한 증상은 더 필요하지만, 처음 단계에서는 거북목 완화에 도움이 되는 기본 루틴을 추천할게요. 목을 강하게 꺾지 말고 편안한 범위에서 진행하세요.",
    };
  }

  return {
    warning: false,
    typeLabel: shortMode ? "거북목 짧은 루틴" : "거북목 기본 루틴",
    routine,
    text:
      shortMode
        ? "짧게 할 수 있는 거북목 루틴을 추천할게요. 공부 중이나 쉬는 시간에도 할 수 있는 구성입니다."
        : "거북목과 말린 어깨 완화에 도움이 되는 기본 루틴을 추천할게요. 목 주변 긴장을 낮춘 뒤 턱 당기기와 가슴 열기 동작으로 정렬을 회복하는 흐름입니다.",
  };
}

export default function TurtleNeckAIStretchApp() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [lastPlan, setLastPlan] = useState(null);

  const totalTime = useMemo(() => {
    if (!lastPlan?.routine?.length) return "-";
    const minutes = lastPlan.routine
      .map((item) => Number(item.time.replace("분", "")))
      .reduce((a, b) => a + b, 0);
    return `${minutes}분`;
  }, [lastPlan]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const aiPlan = buildAIResponse(input);
    const aiMessage = { role: "ai", text: aiPlan.text };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setLastPlan(aiPlan);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const quickPrompts = [
    "거북목이 있고 목이 뻐근해. 기본 루틴 알려줘.",
    "공부하다가 목이 아파. 5분 루틴 알려줘.",
    "어깨가 말리고 목이 앞으로 나온 것 같아.",
    "목이 아프고 손 저���이 있어.",
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 md:text-4xl">
                거북목 AI 스트레칭 코치
              </h1>
              <p className="mt-2 text-slate-600">
                사용자의 목 불편감과 생활 습관을 대화로 파악하고, 거북목 완화에 맞춘 스트레칭 루틴을 추천하는 앱입니다.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              1차 MVP: 거북목 전용
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="p-4 md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h2 className="text-xl font-semibold">AI 상담 채팅</h2>
              </div>

              <div className="h-[460px] space-y-4 overflow-y-auto rounded-2xl bg-slate-100 p-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="mt-1 rounded-full bg-white p-2 shadow-sm">
                        <Bot className="h-4 w-4" />
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
                        <User className="h-4 w-4" />
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
                  placeholder="예: 거북목이 있고 목이 뻐근해. 5분 루틴 알려줘."
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                />
                <Button onClick={sendMessage} className="rounded-2xl px-4 py-6">
                  <Send className="h-4 w-4" />
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
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">추천 루틴</h2>
                </div>

                {!lastPlan ? (
                  <p className="text-sm text-slate-500">
                    AI와 대화하면 이곳에 거북목 맞춤 루틴이 표시됩니다.
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
                          <Clock className="h-3 w-3" /> 예상 시간
                        </div>
                        <p className="mt-1 font-semibold">{totalTime}</p>
                      </div>
                    </div>

                    {lastPlan.warning && (
                      <div className="flex gap-2 rounded-2xl bg-amber-100 p-3 text-sm text-amber-900">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
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

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">현재 포함된 기능</h2>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• 거북목 관련 증상 키워드 감지</li>
                  <li>• 기본 루틴 / 짧은 루틴 자동 추천</li>
                  <li>• 저림, 마비, 어지러움 등 위험 신호 감지</li>
                  <li>• 대화형 입력과 추천 루틴 카드 표시</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}