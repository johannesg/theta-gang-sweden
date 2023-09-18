declare module "jstat" {
    namespace jStat {
        export namespace normal {
            export function pdf(x: number, mean: number, std: number): number;
            export function cdf(x: number, mean: number, std: number): number;
        }
    }
}
