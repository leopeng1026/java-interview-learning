import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';
import { useProgressStore } from '../store/progressStore';

interface ImportExportProps {
  onImportSuccess?: () => void;
}

export default function ImportExport({ onImportSuccess }: ImportExportProps) {
  const { progress, exportProgress, importProgress } = useProgressStore();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState('');

  const handleExport = () => {
    const content = exportProgress();
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-${new Date().toISOString().split('T')[0]}.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setImportStatus('success');
    setTimeout(() => setImportStatus('idle'), 2000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importProgress(content);
      setImportStatus(success ? 'success' : 'error');
      if (success && onImportSuccess) {
        onImportSuccess();
      }
      setTimeout(() => setImportStatus('idle'), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-serif font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">💾</span>
        进度同步
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        导出进度文件并提交到GitHub，换设备时导入即可继续学习
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-800">导出进度</div>
            <div className="text-xs text-gray-500 mt-1">
              生成 progress.ts 文件，提交到GitHub
            </div>
            <div className="text-xs text-gray-400 mt-1">
              最后更新：{new Date(progress.lastUpdated).toLocaleString('zh-CN')}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出
          </motion.button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-800">导入进度</div>
            <div className="text-xs text-gray-500 mt-1">
              从GitHub拉取最新的 progress.ts 文件
            </div>
            {fileName && (
              <div className="text-xs text-gray-400 mt-1">
                已选择：{fileName}
              </div>
            )}
          </div>
          <label className="btn-secondary flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            导入
            <input
              type="file"
              accept=".ts,.json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {importStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg"
          >
            <Check className="w-5 h-5" />
            <span className="text-sm">操作成功！</span>
          </motion.div>
        )}

        {importStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">导入失败，请检查文件格式</span>
          </motion.div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 text-sm mb-2">💡 使用指南</h4>
          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>练习完成后，点击「导出」下载进度文件</li>
            <li>将下载的 .ts 文件替换项目中的 <code className="bg-blue-100 px-1 rounded">src/data/progress.ts</code></li>
            <li>提交到GitHub：<code className="bg-blue-100 px-1 rounded">git add . && git commit -m "更新进度" && git push</code></li>
            <li>换设备后，从GitHub拉取最新代码</li>
            <li>点击「导入」选择新的 progress.ts 文件即可</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
