using UnityEngine;

public class CursorController : MonoBehaviour {
    // Start is called before the first frame update
    void Start() {
        Cursor.visible = false;

    }

    // Update is called once per frame
    void Update() {
        var v = Camera.main.ScreenToWorldPoint(new(Input.mousePosition.x, Input.mousePosition.y, Camera.main.transform.position.z));
        transform.position = new(v.x, v.y, -1);
    }
}
