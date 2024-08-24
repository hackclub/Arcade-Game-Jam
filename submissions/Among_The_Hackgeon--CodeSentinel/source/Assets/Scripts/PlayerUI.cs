using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class PlayerUI : MonoBehaviour {
    public Transform _bulletDisplayContent;
    public Transform _weaponDisplayContent;
    public Transform _dashDisplay;
    public Transform _allBUlletDisplay;
    public Transform _blankDisplay;
    public Transform _healthDisplay;
    public static PlayerUI _I;

    void Awake() {
        _I = this;
        _dashDisplay = transform.Find("DASH_DISPLAY");
        _healthDisplay = transform.Find("HEALTH_DISPLAY ");
        _bulletDisplayContent = transform.Find("BULLET_DISPLAY");
        _weaponDisplayContent = transform.Find("WEAPON_DISPLAY");
        _allBUlletDisplay = transform.Find("ALL_BULLET_DISPLAY");
        _blankDisplay = transform.Find("BLANK_DISPLAY");
    }
    public void DecaresBullet(int a, int val, int maxVal) {
        if (_bulletDisplayContent.childCount == 0) return;
        List<GameObject> toDestr = new();
        for (int i = 0; i < a; i++) {
            toDestr.Add(_bulletDisplayContent.GetChild(i).gameObject);
        }
        if (toDestr.Count > 0) {
            foreach (GameObject obj in toDestr) {
                Destroy(obj);
            }
        }
        _allBUlletDisplay.GetComponent<TextMeshProUGUI>().text = $"{val}/{maxVal}";

    }
    public void IncreaseBullet(int val, int maxVal) {
        for (int i = 0; i < val; i++) {
            RectTransform g = new GameObject("bullet", typeof(RectTransform)).GetComponent<RectTransform>();
            g.SetParent(_bulletDisplayContent, false);
            g.gameObject.AddComponent<Image>().sprite = GameDataManager._I._bulletSprite;
        }
        _allBUlletDisplay.GetComponent<TextMeshProUGUI>().text = $"{val}/{maxVal}";
    }
    public void ResetBullets(int val, int maxVal) {
        DecaresBullet(_bulletDisplayContent.childCount, val, maxVal);
        IncreaseBullet(val, maxVal);
    }
    public void ChangeWeapon(Sprite sprite) {
        _weaponDisplayContent.GetComponent<Image>().sprite = sprite;
    }
    public IEnumerator DisplayReload(float time) {
        Image p = _weaponDisplayContent.Find("PANEL").GetComponent<Image>();
        float val = 0;
        for (int i = 0; i < 40; i++) {
            val += time / 40;
            p.fillAmount = Mathf.InverseLerp(0, time, val);
            yield return new WaitForSeconds(time / 40);

        }
        p.fillAmount = 0;
    }
    public void DecaresBlank(int a) {
        if (_blankDisplay.childCount == 0) return;
        List<GameObject> toDestr = new();
        for (int i = 0; i < a; i++) {
            toDestr.Add(_blankDisplay.GetChild(i).gameObject);
        }
        if (toDestr.Count > 0) {
            foreach (GameObject obj in toDestr) {
                Destroy(obj);
            }
        }
    }
    public void IncreaseBlank(int val) {
        for (int i = 0; i < val; i++) {
            RectTransform g = new GameObject("blank", typeof(RectTransform)).GetComponent<RectTransform>();
            g.SetParent(_blankDisplay, false);
            var I = g.gameObject.AddComponent<Image>();
            I.sprite = GameDataManager._I._blankSprite;
            I.color = Color.blue;
        }
    }
    public void ResetBlanks(int val) {
        DecaresBlank(_blankDisplay.childCount);
        IncreaseBlank(val);
    }

    public void RefreshHealth(float newValue, float maxVal) {
        _healthDisplay.GetChild(0).GetComponent<Image>().fillAmount = Mathf.InverseLerp(0, maxVal, newValue);
        _healthDisplay.GetChild(1).GetComponent<TextMeshProUGUI>().text = $"Health {newValue:f0}/{maxVal:f0}";
    }
    public void RefreshDash(float newValue, float maxVal) {
        _dashDisplay.GetChild(0).GetComponent<Image>().fillAmount = Mathf.InverseLerp(0, maxVal, newValue);
        _dashDisplay.GetChild(1).GetComponent<TextMeshProUGUI>().text = $"Dash {newValue:f0}/{maxVal:f0}";
    }
}
