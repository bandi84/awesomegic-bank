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

  it("resolves with the user's answer", async () => {
    questionMock.mockImplementation((query: string, cb: (answer: string) => void) => cb("test answer"));
    const answer = await askQuestion("What is your name?");
    expect(answer).toBe("test answer");
  });

  it("calls readline.createInterface with correct arguments", async () => {
    questionMock.mockImplementation((query: string, cb: (answer: string) => void) => cb("answer"));
    await askQuestion("Question?");
    expect(readline.createInterface).toHaveBeenCalledWith({
      input: process.stdin,
      output: process.stdout,
    });
  });

  it("calls rl.question with the provided query", async () => {
    questionMock.mockImplementation((query: string, cb: (answer: string) => void) => cb("answer"));
    await askQuestion("Favorite color?");
    expect(questionMock).toHaveBeenCalledWith("Favorite color?", expect.any(Function));
  });

  it("calls rl.close after answering", async () => {
    questionMock.mockImplementation((query: string, cb: (answer: string) => void) => cb("answer"));
    await askQuestion("Close test?");
    expect(closeMock).toHaveBeenCalled();
  });
});