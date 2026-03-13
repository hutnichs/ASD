/*using System;

class Program
{
    static double RecDown(int i, int n, double x, double prevF, double sum)
    {
        if (i > n)
            return sum;

        double f;

        if (i == 1)
            f = x;
        else if (i == 2)
            f = x * x / 2;
        else
            f = -prevF * x * (i - 1) * (i - 2) / (i * i - i);

        return RecDown(i + 1, n, x, f, sum + f);
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

        double sum = RecDown(1, n, x, 0, 0);

        Console.WriteLine("Sum = " + sum);
        Console.WriteLine("ln(1+x) = " + Math.Log(1 + x));
    }
}*/