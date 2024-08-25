using System;
using UnityEngine;

public class TickCounter : MonoBehaviour {
    public static Action<int> _onTick;
    public static float _tickInterval;

    [SerializeField] private float _tickIntervalSetting;
    private int _ticks = 1;
    private float _counter = 1;

    void Awake() {
        Refresh();
        _counter = _tickInterval;
    }
    public void Refresh() {
        _tickInterval = _tickIntervalSetting;
        if (_tickInterval == 0) {
            Debug.LogError("_tickInterval can't be less or equal 0");
            _tickInterval = 1;
        }
    }

    void Update() {
        _counter -= Time.deltaTime;
        if (_counter <= 0) {
            _onTick?.Invoke(_ticks);
            _ticks += 1;
            if (_ticks == 101) _ticks = 1;
            _counter = _tickInterval;
        }
    }
}
