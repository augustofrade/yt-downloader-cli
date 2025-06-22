import chalk from "chalk";

export default class ConsoleLogger {
  public static showError(msg: string): void {
    console.log(chalk.bgRed(msg));
  }

  public static showWarning(msg: string): void {
    console.log(chalk.yellow.bold(msg));
  }

  public static showSuccess(msg: string): void {
    console.log(chalk.green(msg));
  }
}
