/* 주아쌤_소리튠영어 — 연음·축약 리스닝 훈련 (교안: 소리튠 영어 연음·축약 리스닝 훈련 30 핵심 소리블록)
   영상은 30문장을 두 번 돌려요(1회차 1:02–22:50, 2회차 23:15–). 1회차만 북마크 */
window.VIDEO=(function(){
/* 문장 || 뜻,  *…* = 교안의 소리블록,  "? " = 한국어 소리 · 블록 뜻 — 소리 설명 */
const RAW = `
## Do you · What · Is that|질문을 여는 소리블록
*Do you have any* rooms available? || 빈방 있나요?
? 듀해브니 · ~이 좀 있나요? — you와 have가 약해지면서 뒤의 any까지 한 덩어리로 이어져요.
*Do you want any* help? || 도움 필요하세요?
? 듀워니 · ~을 좀 원하세요? — do you가 빠르게 붙고, want any의 경계도 약해져요.
Do *you mind if I* ask you a question? || 질문 하나 해도 될까요?
? 유만어바이 · 제가 ~해도 괜찮을까요? — mind if I를 따로 끊지 않고 이어지는 소리로 들어보세요.
*What is this* place called? || 이곳 이름이 뭐예요?
? 와리지스 · 이것은 무엇인가요? — what is가 붙고, 뒤의 this까지 빠르게 이어져요.
*What does this* mean? || 이게 무슨 뜻이에요?
? 와르지스 · 이것이 무엇을 ~하나요? — does가 약해지면서 what does this가 한 덩어리로 들려요.
*Is that what I* think it is? || 저거 제가 생각하는 그거 맞나요?
? 싸워라이 · 저게 제가 ~하는 그건가요? — is that의 시작 소리가 약해지고, what I도 서로 붙어요.
## 의문사 + you|What · Why · When · Where · How
*What are you* going to do today? || 오늘 뭐 할 거예요?
? 워러유 · 무엇을 ~하고 있나요? — what의 끝소리와 are가 이어지고, are는 약하게 들려요.
*What do you* want to do tonight? || 오늘 저녁에 뭐 하고 싶어요?
? 와루유 · 무엇을 ~하나요? — what do you에서 do와 you가 약해지는 부분에 집중하세요.
*Why are you* so late? || 왜 이렇게 늦었어?
? 와이유 · 왜 ~한가요? — are가 짧고 약해져 why와 you 사이가 빠르게 이어져요.
*When are you* coming back? || 언제 돌아올 거예요?
? 원이유 · 언제 ~하나요? — when are you를 단어별로 끊지 않고 통째로 들어보세요.
*Where are you* going to stay tonight? || 오늘 밤 어디서 묵을 거예요?
? 워이유 · 어디에 있나요? / 어디서 ~하나요? — where are의 비슷한 소리가 겹치며 짧게 이어져요.
*Where did you* get that from? || 그거 어디서 구했어요?
? 월쥬 · 어디서 ~했나요? — did의 끝소리와 you의 첫소리가 만나 '쥬'처럼 들릴 수 있어요.
*How do you* want to pay? || 어떻게 결제하시겠어요?
? 하리유 · 어떻게 ~하나요? — do you가 약해지면서 how 뒤에 짧게 이어져요.
*How did you* get here so fast? || 어떻게 이렇게 빨리 왔어요?
? 하우쥬 · 어떻게 ~했나요? — did you가 붙으며 '쥬'에 가까운 소리로 들릴 수 있어요.
## Could you · Would you|부탁·제안의 '쥬'
*Could you* tell me how to get there? || 거기 어떻게 가는지 알려주시겠어요?
? 쿠쥬 · ~해주시겠어요? — could의 끝소리와 you가 붙어 '쿠쥬'처럼 들릴 수 있어요.
*Would you* like something to drink? || 마실 것 좀 드릴까요?
? 우쥬 · ~하시겠어요? — would의 끝소리와 you가 붙어 '우쥬'처럼 들릴 수 있어요.
## 줄어드는 소리|should have · gonna · wanna · gotta
We *should have* left earlier. || 우리 더 일찍 출발했어야 했어.
? 슈더 · ~했어야 했는데 — have의 h와 모음이 약해지면서 should 뒤에 짧게 붙어요.
*I'm going to* get something to eat. || 뭐 좀 먹으러 갈 거예요.
? 암거나 · 저는 ~할 거예요 — going to가 빠른 말에서 gonna처럼 줄어들 수 있어요.
*I don't know* how to get there. || 거기 어떻게 가는지 모르겠어요.
? 아론노 · 저는 몰라요 — don't의 끝소리가 약해지고, know까지 끊김 없이 이어져요.
Do you *want to* get something to eat? || 뭐 좀 먹으러 갈래?
? 워너 · ~하고 싶다 — want to가 빠른 말에서 wanna처럼 줄어들 수 있어요.
We've *got to* get to the airport. || 우리 공항에 가야 해.
? 가러 · ~해야 한다 — got to의 가운데 소리가 약해지며 한 덩어리로 이어져요.
## of · bit · me · him|약해지는 작은 단어
I'm *kind of* hungry. || 나 좀 배고파.
? 카인다 · 좀 / 약간 — of가 약해지면서 kind 뒤에 짧게 붙어요.
I think we're running *out of* time. || 우리 시간이 얼마 안 남은 것 같아.
? 아우러 · ~밖으로 / ~이 떨어져서 — out의 t가 약하게 굴러가고, of의 모음도 짧아져요.
There are *a lot of* people here. || 여기 사람이 정말 많네요.
? 얼라러 · 많은 — a, lot, of를 끊지 말고 이어지는 리듬으로 들어보세요.
I'm a *little bit* nervous. || 조금 긴장돼요.
? 리를빗 · 조금 / 약간 — little의 가운데 t가 약하게 굴러가고, bit가 바로 이어져요.
*Give me* a little more time. || 시간을 조금만 더 주세요.
? 김미 · 저에게 ~을 주세요 — give me가 빠른 말에서 gimme처럼 줄어들 수 있어요.
*Tell him* I'll be right there. || 그분에게 제가 곧 간다고 전해주세요.
? 텔림 · 그에게 ~라고 말해주세요 — him의 h가 약해지면서 tell의 끝소리에 바로 붙어요.
## 이어지는 소리|check it out · take it easy · get out of
Let me *check it out*. || 제가 한번 확인해볼게요.
? 체키라웃 · 그것을 확인하다 / 살펴보다 — check의 끝소리가 it으로, it의 끝소리가 out으로 이어져요.
You need to *take it easy*. || 좀 쉬면서 무리하지 않는 게 좋겠어요.
? 테키리지 · 무리하지 않다 / 쉬엄쉬엄 하다 — take it과 it easy의 경계가 이어져 하나처럼 들려요.
How do we *get out of* here? || 여기서 어떻게 나가죠?
? 게라우러 · ~에서 나가다 / 벗어나다 — get out이 붙고, out of의 t와 of도 약하게 이어져요.
`;

/* 문장별 영상 시작 시간(초) — 1회차에서 그 문장의 빈칸 듣기가 시작되는 지점 */
const TIMES=[62, 105, 147, 197, 243, 284,
 337, 374, 419, 459, 502, 540, 574, 614,
 654, 707,
 754, 808, 846, 887, 936,
 974, 1023, 1079, 1117, 1160, 1211,
 1258, 1290, 1337];

return {RAW,TIMES};
})();
