using UnityEngine;

namespace MyUtils.Functions {
    public static class MyRandom {
        public static T GetFromArray<T>(T[] a) {
            return a[Random.Range(0, a.Length)];
        }
    }
}
