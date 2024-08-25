using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class BossUI : MonoBehaviour {
    public Image _healthDisplay;
    public TextMeshProUGUI _healthText;
    public TextMeshProUGUI _nameDisplay;
    public static BossUI _I;
    void Awake() {
        _I = this;
        // _healthDisplay = transform.Find("HEALTH").GetChild(0).GetComponent<Image>();
        // _healthText = transform.Find("HEALTH").GetChild(0).GetComponent<TextMeshProUGUI>();
        // _nameDisplay = transform.Find("NAME_DISPLAY").GetChild(0).GetComponent<TextMeshProUGUI>();
    }
    public void ChangeName(bool invincible, int enemiesCount, int stage) {
        if (invincible) {
            _nameDisplay.text = $"(INVINCIBLE) Mega Hackongus Enemies left:{enemiesCount} Stage: {stage + 1}/ 5";
        } else {
            _nameDisplay.text = $"Mega Hackongus Stage: {stage + 1}/ 5";
        }
    }
    public void UpdateHealth(float current, float max) {
        _healthText.text = $"{current:f0}/{max:f0}";
        _healthDisplay.fillAmount = current / max;
    }
}
