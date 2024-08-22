using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class EndTrigger : MonoBehaviour
{
    public string sceneToLoad; // Name of the scene to load

    void OnTriggerEnter(Collider other)
    {
        // Check if the player (or any specific object) entered the trigger
        if (other.CompareTag("P")) // Make sure your player has the tag "Player"
        {
            // Load the specified scene
            SceneManager.LoadScene(sceneToLoad);
        }
    }
}
