#nullable disable
using System;
class Node
{
    public int data;
    public Node next;
    public Node(int d) { data = d; }
}

class Program
{
    static void AddLast(ref Node head, int x)
    {
        if (head == null) { head = new Node(x); return; }
        Node t = head;
        while (t.next != null) t = t.next;
        t.next = new Node(x);
    }

    static void Print(Node head)
    {
        for (Node t = head; t != null; t = t.next)
            Console.Write(t.data + " ");
        Console.WriteLine();
    }

    static int CountGreater(Node head, int M)
    {
        int p = 0;
        for (Node t = head; t != null; t = t.next)
            if (t.data > M) p++;
        return p;
    }

    static void InsertAfterK(Node head, int k, int p)
    {
        Node t = head;
        for (int i = 1; i < k && t != null; i++)
            t = t.next;

        for (int i = 0; i < p && t != null; i++)
        {
            Node n = new Node(0);
            n.next = t.next;
            t.next = n;
            t = n;
        }
    }

    static void Main()
    {
        Node head = null;
        Random r = new Random();

        Console.Write("Введіть n: ");
        int n = int.Parse(Console.ReadLine());

        for (int i = 0; i < n; i++)
            AddLast(ref head, r.Next(0, 100));

        Print(head);

        Console.Write("Введіть M: ");
        int M = int.Parse(Console.ReadLine());

        int p = CountGreater(head, M);
        Console.WriteLine("p = " + p);

        Console.Write("Введіть k: ");
        int k = int.Parse(Console.ReadLine());

        InsertAfterK(head, k, p);

        Print(head);
    }
}