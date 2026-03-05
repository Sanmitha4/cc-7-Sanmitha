import { Stack } from '../Stack/stack';

export function evaluateExpression(expression: string): number {
  
  if (/[^0-9+\-*/()\s]/.test(expression)) {
    throw new Error("Invalid characters detected. Only digits and + - * / ( ) are allowed.");
  }

  const values = new Stack<number>();
  const ops = new Stack<string>();

  const precedence = (op: string): number => {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
  };

  const applyOp = (b: number, a: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a/b;
        // if (b === 0) throw new Error("Division by zero error.");
        // return a / b;
      default: return 0;
    }
  };

  const tokens = expression.match(/\d+|[+*/()-]/g) || [];
  if (tokens.length === 0) throw new Error("Expression evaluation failed: Empty expression.");

  for (const token of tokens) {
    if (/\d+/.test(token)) {
      values.push(parseInt(token, 10));
    } else if (token === '(') {
      ops.push(token);
    } else if (token === ')') {
      while (ops.top() !== null && ops.top() !== '(') {
        processTop(values, ops, applyOp);
      }
      if (ops.top() === null) throw new Error("Mismatched parentheses: Missing opening '('");
      ops.pop(); 
    } else {
      while (ops.top() !== null && precedence(ops.top()!) >= precedence(token)) {
        processTop(values, ops, applyOp);
      }
      ops.push(token);
    }
  }

  while (ops.top() !== null) {
    if (ops.top() === '(') throw new Error("Mismatched parentheses: Missing closing ')'");
    processTop(values, ops, applyOp);
  }

  const finalResult = values.pop();
  return finalResult;
}
function processTop(
  values: Stack<number>, 
  ops: Stack<string>, 
  applyOp: (b: number, a: number, op: string) => number
) {
  const op = ops.pop()!;
  
  try {
    const b = values.pop();
    const a = values.pop();
    values.push(applyOp(b, a, op));
  } catch (error) {
    // Re-throwing with 'cause' preserves the original error stack
    throw new Error(`Insufficient operands for operator: ${op}`, { cause: error });
  }
}
