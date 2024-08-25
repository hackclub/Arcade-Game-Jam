using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public static class SaveSystem {
    public const string PLAYER_DATA_DEFAULT_SAVE_PATH = "PlayerData";
    public const string SETTINGS_DEFAULT_SAVE_PATH = "Settings";
    public static string PERSISTANCE_DATA_PATH = Application.persistentDataPath;

    public static void Save<T>(string path, string name, T data, string ext = ".json") {
        path = Path.Combine(PERSISTANCE_DATA_PATH, path);
        try {
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);
            string fullPath = Path.Combine(path, name + ext);
            string jsonData = JsonUtility.ToJson(data);
            using FileStream stream = new(fullPath, FileMode.Create);
            using StreamWriter writer = new(stream);
            writer.Write(jsonData);
        }
        catch (SystemException e) {
            Debug.LogError("Error while trying to save file: " + name + "\nError: " + e);
        }

    }
    public static List<string> GetAllFileNameFromDirectory(string path, string ext = ".json") {
        List<string> result = new();
        string fullPath = Path.Combine(PERSISTANCE_DATA_PATH, path);
        if (!Directory.Exists(fullPath)) Directory.CreateDirectory(fullPath);
        try {
            foreach (var s in Directory.GetFiles(fullPath, "*" + ext, SearchOption.TopDirectoryOnly)) {
                string name = Path.GetFileNameWithoutExtension(s);
                result.Add(name);
            }
        }
        catch (SystemException e) {
            Debug.Log("Fetching directory failed. \nError:: " + e);
        }

        return result;
    }


    public static T Load<T>(string path, string name, string ext = ".json") {

        T loadedData = default;
        string fullPath = Path.Combine(PERSISTANCE_DATA_PATH, path, name + ext);
        try {
            if (File.Exists(fullPath)) {

                string dataToLoad = "";
                using (FileStream stream = new(fullPath, FileMode.Open)) {
                    using StreamReader reader = new(stream);
                    dataToLoad = reader.ReadToEnd();
                }

                loadedData = JsonUtility.FromJson<T>(dataToLoad);
            }
        }
        catch (SystemException e) {
            Debug.Log("Loading data failed \nError:" + e);
        }
        return loadedData;
    }

    public static void DeleteSave(string path, string name, string ext = ".json") {
        try {
            string fullPath = Path.Combine(PERSISTANCE_DATA_PATH, path, name + ext);
            if (File.Exists(fullPath)) {
                File.Delete(fullPath);
            }
        }
        catch (SystemException e) {
            Debug.Log("Deleting file failed. \nError: " + e);
        }
    }
}
