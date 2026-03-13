/*using System;

class Program
{
    static double Term(int i, double x)
    {
        if (i == 1) return x;
        if (i == 2) return x * x / 2;

        double prev = Term(i - 1, x);
        return -prev * x * (i - 1) * (i - 2) / (i * i - i);
    }

    static double SumReturn(int n, double x)
    {
        if (n == 1)
            return x;

        return SumReturn(n - 1, x) + Term(n, x);
    }

    static void Main()
    {
        Console.Write("n = ");
        int n = int.Parse(Console.ReadLine());

        Console.Write("x = ");
        double x = double.Parse(Console.ReadLine());

        if (x <= -1 || x >= 2)
        {
            Console.WriteLine("x must be between -1 and 2 (not including)");
            return;
        }

        double sum = SumReturn(n, x);

        Console.WriteLine("Sum = " + sum);
        Console.WriteLine("ln(1+x) = " + Math.Log(1 + x));
    }
}*/