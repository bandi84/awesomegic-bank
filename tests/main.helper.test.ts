import { MESSAGES } from "../src/constants/messages";
import { askQuestion } from "../src/main.helper";
import readline from "readline";

jest.mock("readline", () => {
  const questionMock = jest.fn();
  const closeMock = jest.fn();
  return {
    createInterface: jest.fn(() => ({
      question: questionMock,
      close: closeMock,
    })),
    __mocks__: {
      questionMock,
      closeMock,
    },
  };
});


describe("askQuestion", () => {
  const questionMock = (readline as any).__mocks__.questionMock as jest.Mock;
  const closeMock = (readline as any).__mocks__.closeMock as jest.Mock;

  beforeEach(() => {
    questionMock.mockReset();
    closeMock.mockReset();
  });

  it("should resolve with the user's answer", async () => {
    questionMock.mockImplementation((query: string, cb: (answer: string) => void) => cb("t"));
    const answer = await askQuestion(MESSAGES.WELCOME);
    expect(answer).toBe("t");
  });

  it("should call readline.createInterface with correct arguments", async () => {
    questionMock.mockImplementation((query: string, cb: (answer: string) => void) => cb("answer"));
    await askQuestion(MESSAGES.INPUT_TRANSACTION_PROMPT);
    expect(readline.createInterface).toHaveBeenCalledWith({
      input: process.stdin,
      output: process.stdout,
    });
  });

  it("should call rl.question with the provided query", async () => {
    questionMock.mockImplementation((query: string, cb: (answer: string) => void) => cb("answer"));
    await askQuestion(MESSAGES.INTEREST_RULE_PROMPT);
    expect(questionMock).toHaveBeenCalledWith(MESSAGES.INTEREST_RULE_PROMPT, expect.any(Function));
  });
});