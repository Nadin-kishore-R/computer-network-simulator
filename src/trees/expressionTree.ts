import { ExpressionTreeNode, ExpressionEvaluationStep } from '../types/tree';

export interface EvaluationResult {
  value: number;
  steps: ExpressionEvaluationStep[];
  inorder: string;
  preorder: string;
  postorder: string;
}

export class ExpressionTree {
  private root: ExpressionTreeNode | null = null;
  private postfixTokens: string[] = [];

  private static readonly OPERATORS = new Set(['+', '-', '*', '/', '^', '%']);

  public static isOperator(token: string): boolean {
    return ExpressionTree.OPERATORS.has(token);
  }

  public getRoot(): ExpressionTreeNode | null {
    return this.root;
  }

  /**
   * Validate and tokenize a postfix string.
   * e.g., "100 50 + 2 *" or "1000 8 / 125 -"
   */
  public static validateAndTokenize(postfix: string): string[] {
    const trimmed = postfix.trim();
    if (!trimmed) {
      throw new Error('Expression cannot be empty.');
    }

    const tokens = trimmed.split(/\s+/);
    let operandCount = 0;

    for (const token of tokens) {
      if (ExpressionTree.isOperator(token)) {
        if (operandCount < 2) {
          throw new Error(
            `Malformed postfix expression: Operator '${token}' requires 2 operands, but only ${operandCount} available.`
          );
        }
        operandCount--; // consumes 2, produces 1
      } else {
        const num = Number(token);
        if (isNaN(num)) {
          throw new Error(`Invalid operand '${token}'. Only valid numerical constants or metrics are accepted.`);
        }
        operandCount++;
      }
    }

    if (operandCount !== 1) {
      throw new Error(
        `Invalid postfix expression: Too many operands without corresponding operators (remaining: ${operandCount}).`
      );
    }

    return tokens;
  }

  /**
   * Construct Expression Tree from postfix string
   */
  public buildFromPostfix(postfix: string): ExpressionTreeNode {
    const tokens = ExpressionTree.validateAndTokenize(postfix);
    this.postfixTokens = tokens;
    const stack: ExpressionTreeNode[] = [];

    for (const token of tokens) {
      if (ExpressionTree.isOperator(token)) {
        const right = stack.pop()!;
        const left = stack.pop()!;
        const node: ExpressionTreeNode = {
          value: token,
          isOperator: true,
          left,
          right,
        };
        stack.push(node);
      } else {
        const node: ExpressionTreeNode = {
          value: token,
          isOperator: false,
          left: null,
          right: null,
        };
        stack.push(node);
      }
    }

    if (stack.length !== 1) {
      throw new Error('Failed to build unique root for expression tree.');
    }

    this.root = stack[0];
    return this.root;
  }

  /**
   * Inorder representation: (Left op Right)
   */
  public toInorder(node: ExpressionTreeNode | null = this.root): string {
    if (!node) return '';
    if (!node.isOperator) return node.value;

    const leftStr = this.toInorder(node.left);
    const rightStr = this.toInorder(node.right);
    return `(${leftStr} ${node.value} ${rightStr})`;
  }

  /**
   * Preorder representation (Prefix / Polish Notation)
   */
  public toPreorder(node: ExpressionTreeNode | null = this.root): string {
    if (!node) return '';
    if (!node.isOperator) return node.value;

    const leftStr = this.toPreorder(node.left);
    const rightStr = this.toPreorder(node.right);
    return `${node.value} ${leftStr} ${rightStr}`.trim();
  }

  /**
   * Postorder representation (Postfix / Reverse Polish Notation)
   */
  public toPostorder(node: ExpressionTreeNode | null = this.root): string {
    if (!node) return '';
    if (!node.isOperator) return node.value;

    const leftStr = this.toPostorder(node.left);
    const rightStr = this.toPostorder(node.right);
    return `${leftStr} ${rightStr} ${node.value}`.trim();
  }

  /**
   * Evaluate the expression tree with step-by-step audit
   */
  public evaluate(): EvaluationResult {
    if (!this.root) {
      throw new Error('No expression tree built. Provide a valid postfix expression first.');
    }

    const steps: ExpressionEvaluationStep[] = [];
    let stepCount = 0;

    const evaluateRecursive = (node: ExpressionTreeNode): number => {
      if (!node.isOperator) {
        return parseFloat(node.value);
      }

      const leftVal = evaluateRecursive(node.left!);
      const rightVal = evaluateRecursive(node.right!);

      let result = 0;
      switch (node.value) {
        case '+':
          result = leftVal + rightVal;
          break;
        case '-':
          result = leftVal - rightVal;
          break;
        case '*':
          result = leftVal * rightVal;
          break;
        case '/':
          if (rightVal === 0) {
            throw new Error(`Division by zero encountered during operation: ${leftVal} / ${rightVal}`);
          }
          result = leftVal / rightVal;
          break;
        case '^':
          result = Math.pow(leftVal, rightVal);
          break;
        case '%':
          if (rightVal === 0) {
            throw new Error(`Modulo by zero encountered during operation: ${leftVal} % ${rightVal}`);
          }
          result = leftVal % rightVal;
          break;
        default:
          throw new Error(`Unsupported operator '${node.value}'`);
      }

      stepCount++;
      steps.push({
        stepNumber: stepCount,
        subExpression: `${leftVal} ${node.value} ${rightVal}`,
        operation: `${node.value} applied to operands ${leftVal} and ${rightVal}`,
        result: Math.round(result * 10000) / 10000,
        stackState: [result],
      });

      node.evaluatedValue = result;
      return result;
    };

    const finalVal = evaluateRecursive(this.root);

    return {
      value: Math.round(finalVal * 10000) / 10000,
      steps,
      inorder: this.toInorder(this.root),
      preorder: this.toPreorder(this.root),
      postorder: this.toPostorder(this.root),
    };
  }

  /**
   * Sample expressions for network metrics
   */
  public static getSampleBandwidthFormulas(): { label: string; postfix: string; description: string }[] {
    return [
      {
        label: 'Aggregated Trunk Throughput (Mbps)',
        postfix: '1000 500 + 0.8 *',
        description: '(1000 Mbps link + 500 Mbps link) * 0.8 efficiency factor',
      },
      {
        label: 'Packet Transfer Time (ms)',
        postfix: '1500 8 * 100 /',
        description: '(1500 bytes * 8 bits/byte) / 100 Mbps link speed',
      },
      {
        label: 'Delay-Bandwidth Product (KB)',
        postfix: '100 40 * 8 /',
        description: '(100 Mbps bandwidth * 40 ms RTT) / 8 bits per byte',
      },
      {
        label: 'Buffer Sizing Exponential Growth',
        postfix: '2 8 ^ 64 +',
        description: '(2 ^ 8 slots) + 64 reserve headroom buffers',
      },
    ];
  }
}
