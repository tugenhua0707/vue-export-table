
# git常用命令总结：<br/>
## git 基本添加及提交操作<br/>
pwd:                           显示当前的目录<br/>
git init                       把这个目录变成git可以管理的仓库<br/>
git add xx                     把相对应的文件添加到暂存区里面去<br/>
git commit -m "注释"            把文件提交到仓库。<br/>
git status                     查看状态<br/>
git diff xx                    查看文件到底改了什么内容<br/>
git log                        查看历史记录<br/>
git log -pretty=oneline        精简git log 信息<br/>
cat xx                         查看xx文件的内容<br/>

## git版本回退操作<br/>
git reflog                     可以获取到所有已提交的版本<br/>
git reset --hard HEAD^         版本回退，回到上一个版本<br/>
git reset --hard 版本号         可以回退到具体的版本<br/>

## git 撤销修改和删除文件操作<br/>

git checkout -- xx             把xx文件在工作区的修改全部撤销<br/>

rm xx                          把已添加到版本库的xx文件删除掉，再commit掉即可<br/>

## 远程库的操作<br/>

git clone "git路径"             把远程git文件路径克隆到本地<br/>
git pull                       更新远程库的文件<br/>
git push origin master         把本地的master分支推送到github上，第一次使用需要加上(master)<br/>

## 创建与合并分支
git branch                     查看当前的分支，如果是当前的分支，前面会加一个星号<br/>
git branch name                创建分支<br/>
git checkout name              切换分支<br/>
git checkout -b dev            创建并切换到dev分支上 -b是代表创建并切换<br/>
git merge dev                  把dev分支上的内容合并到当前分支上，在当前分支上执行命令<br/>
git branch -d name             删除分支<br/>

合并代码中如何解决冲突？<br/>
先新建一个新分支，比如名字叫fenzhi1，在readme.txt添加一行内容8888888，然后提交，如下所示：<br/>
<img src="http://images.cnitblog.com/blog/561794/201410/251403184188082.png"/><br/>
同样，我们现在切换到master分支上来，也在最后一行添加内容，内容为99999999，如下所示：<br/>
<img src="http://images.cnitblog.com/blog/561794/201410/251403416053365.png"/><br/>
现在我们需要在master分支上来合并fenzhi1，如下操作：<br/>
<img src="http://images.cnitblog.com/blog/561794/201410/251404228409533.png"/><br/>
Git用<<<<<<<，=======，>>>>>>>标记出不同分支的内容，其中<<<HEAD是指主分支修改的内容，>>>>>fenzhi1 是指fenzhi1上修改的内容，我们可以修改下如下后保存：<br/>
<img src="http://images.cnitblog.com/blog/561794/201410/251404454024875.png"/><br/>
如果我想查看分支合并的情况的话，需要使用命令 git log.命令行演示如下<br/>
<img src="http://images.cnitblog.com/blog/561794/201410/251405055906673.png"/> <br/>

## 远程库信息<br/>
git remote                      查看远程库的信息<br/>
git remote -v                   查看远程库的详细信息<br/>

## 标签管理<br/>
1. 创建标签<br/>
首先，切换到需要打标签的分支上：如下：<br/>
<pre>
  $ git branch
    * dev
    master
  $ git checkout master
    Switched to branch 'master'
</pre><br/>
然后，敲命令git tag <name>就可以打一个新标签：<br/>
<pre>
  $ git tag v1.0
</pre><br/>
可以用命令git tag查看所有标签：如下：<br/>
<pre>
  $ git tag
    v1.0
</pre><br/>
默认标签是打在最新提交的commit上的。有时候，如果忘了打标签,我们找到历史提交的commit id，然后打上就可以了：<br/>
<pre>
  $ git log --pretty=oneline --abbrev-commit
    6a5819e merged bug fix 101
    cc17032 fix bug 101
    7825a50 merge with no-ff
    6224937 add merge
    59bc1cb conflict fixed
    400b400 & simple
    75a857c AND simple
    fec145a branch test
    d17efd8 remove test.txt
    ...
</pre><br/>
比方说要对add merge这次提交打标签，它对应的commit id是6224937，敲入命令：<br/>
<pre>
  $ git tag v0.9 6224937
</pre><br/>
再用命令git tag查看标签：<br/>
<pre>
  $ git tag
    v0.9
    v1.0
</pre><br/>
注意，标签不是按时间顺序列出，而是按字母排序的。可以用git show <tagname>查看标签信息：<br/>
<pre>
  $ git show v0.9
    commit 622493706ab447b6bb37e4e2a2f276a20fed2ab4
    Author: Michael Liao <askxuefeng@gmail.com>
    Date:   Thu Aug 22 11:22:08 2013 +0800

    add merge
</pre><br/>
可以看到，v0.9确实打在add merge这次提交上。<br/>

还可以创建带有说明的标签，用-a指定标签名，-m指定说明文字：<br/>
<pre>
  $ git tag -a v0.1 -m "version 0.1 released" 3628164
</pre><br/>
用命令git show <tagname>可以看到说明文字：<br/>
<pre>
  $ git show v0.1
    tag v0.1
    Tagger: Michael Liao <askxuefeng@gmail.com>
    Date:   Mon Aug 26 07:28:11 2013 +0800

    version 0.1 released

    commit 3628164fb26d48395383f8f31179f24e0882e1e0
    Author: Michael Liao <askxuefeng@gmail.com>
    Date:   Tue Aug 20 15:11:49 2013 +0800
    append GPL
</pre><br/>
